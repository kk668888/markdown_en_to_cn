/**
 * 轻量 Markdown 分段器。
 *
 * 设计取舍：首版不引入完整 Markdown AST 解析器（如 markdown-it / remark），
 * 而是按行扫描，识别标题 / 列表 / 引用 / 代码块 / HTML 块 / 空行等常见结构。
 * 这样可以零依赖地验证「分段 + 锁定 + 回填」的翻译保真流程，
 * 后续若需更强保真，可整体替换为本文件的实现，而无需改动上下游。
 *
 * segment id 约定：按「输出数组的位置」连续编号（seg-1, seg-2, ...），
 * 与数组下标一一对应，便于测试断言与人类阅读。
 */

import type { MarkdownSegment, MarkdownSegmentKind } from '../model/markdown.types';

/** parseLine 的中间产物：尚未赋 id 的分段信息。 */
interface ParsedLine {
  kind: MarkdownSegmentKind;
  raw: string;
  translatableText?: string;
  locked?: boolean;
  prefix?: string;
  suffix?: string;
}

/** 匹配 fenced code block 边界（``` 或 ~~~，允许行首空白）。 */
const FENCE_PATTERN = /^\s*(```|~~~)/;

/** 匹配标题：1~6 个 `#` 加至少一个空白，剩余为标题文本。 */
const HEADING_PATTERN = /^(#{1,6}\s+)(.+)$/;

/** 匹配引用：`>` 加可选空白，剩余为引用文本。 */
const BLOCKQUOTE_PATTERN = /^(>\s?)(.+)$/;

/** 匹配列表：无序（`-` / `*` / `+`）或有序（`1.`），剩余为列表项文本。 */
const LIST_PATTERN = /^(\s*(?:[-*+]|\d+\.)\s+)(.+)$/;

/** 匹配 HTML 块起始（行首 < 视为 HTML，首版整行锁定不翻译）。 */
const HTML_PATTERN = /^\s*</;

/**
 * 解析单行 Markdown（非 fence 状态下调用）。
 * 返回中间产物，由调用方统一赋 id 后 push 到结果数组。
 */
function parseLine(raw: string): ParsedLine {
  // 空行：锁定，输出时原样回填，保留段落间距
  if (raw.trim() === '') {
    return { kind: 'empty', raw, locked: true };
  }

  const heading = raw.match(HEADING_PATTERN);
  if (heading?.[1] && heading[2]) {
    return { kind: 'heading', raw, prefix: heading[1], translatableText: heading[2] };
  }

  const blockquote = raw.match(BLOCKQUOTE_PATTERN);
  if (blockquote?.[1] && blockquote[2]) {
    return {
      kind: 'blockquote',
      raw,
      prefix: blockquote[1],
      translatableText: blockquote[2],
    };
  }

  const list = raw.match(LIST_PATTERN);
  if (list?.[1] && list[2]) {
    return { kind: 'list', raw, prefix: list[1], translatableText: list[2] };
  }

  // HTML 块：锁定，避免破坏标签结构
  if (HTML_PATTERN.test(raw)) {
    return { kind: 'html', raw, locked: true };
  }

  // 兜底为普通段落；行内 code 反引号保留在文本中，引擎应原样保留
  return { kind: 'paragraph', raw, translatableText: raw };
}

/**
 * 将解析结果赋连续 id 后追加到 segments 数组。
 * id 基于「当前数组长度 + 1」，确保连续且与下标对齐。
 */
function appendSegment(segments: MarkdownSegment[], parsed: ParsedLine): void {
  segments.push({
    id: `seg-${segments.length + 1}`,
    kind: parsed.kind,
    raw: parsed.raw,
    translatableText: parsed.translatableText ?? '',
    locked: parsed.locked ?? false,
    prefix: parsed.prefix,
    suffix: parsed.suffix,
  });
}

/**
 * 把 Markdown 文本分段。
 *
 * 状态机：
 *   默认状态 → 逐行 parseLine；
 *   遇到 fence 起始 → 进入 fence 缓冲，直到匹配到结束 fence；
 *   文本结束时若仍在 fence 中 → 视为一个未闭合代码块，整体锁定。
 *
 * @param content 原始 Markdown 字符串
 * @returns 分段数组，id 连续
 */
export function segmentMarkdown(content: string): MarkdownSegment[] {
  const lines = content.split(/\r?\n/);
  const segments: MarkdownSegment[] = [];

  let isInFence = false;
  let fenceBuffer: string[] = [];

  for (const line of lines) {
    const isFence = FENCE_PATTERN.test(line);

    // 进入 fence：开始缓冲，本行不计入普通分段
    if (isFence && !isInFence) {
      isInFence = true;
      fenceBuffer = [line];
      continue;
    }

    if (isInFence) {
      fenceBuffer.push(line);
      // 再次遇到 fence 边界视为结束；缓冲至少含起始行 + 结束行
      if (isFence && fenceBuffer.length > 1) {
        appendSegment(segments, {
          kind: 'code',
          raw: fenceBuffer.join('\n'),
          locked: true,
        });
        isInFence = false;
        fenceBuffer = [];
      }
      continue;
    }

    appendSegment(segments, parseLine(line));
  }

  // 兜底：未闭合的 fence（文档结束前没遇到结束边界）整体锁定为一个代码段，
  // 避免把代码内容误当作普通段落送去翻译
  if (isInFence && fenceBuffer.length > 0) {
    appendSegment(segments, {
      kind: 'code',
      raw: fenceBuffer.join('\n'),
      locked: true,
    });
  }

  return segments;
}
