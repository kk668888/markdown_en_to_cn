/**
 * 输出合成器：根据分段、翻译结果与输出模式，合成最终 Markdown。
 *
 * 职责边界：
 *   - 锁定片段：原样回填 raw（保留代码块、HTML 块、空行的位置）。
 *   - 纯译文模式：用 prefix + 译文 + suffix 还原行结构。
 *   - 中英对照模式：用引用块分别呈现原文与译文。
 *
 * 该函数是纯函数，不依赖 Vue/DOM，便于单元测试。
 */

import type {
  MarkdownSegment,
  OutputMode,
  TranslationResult,
} from '../model/markdown.types';
import { mapResultsBySegmentId } from '../model/translate.mapper';

interface ComposeOutputParams {
  segments: MarkdownSegment[];
  results: TranslationResult[];
  outputMode: OutputMode;
}

/** 还原纯译文行：保留 Markdown 前缀/后缀，仅替换文本部分。 */
function composeTranslatedLine(segment: MarkdownSegment, translatedText: string): string {
  return `${segment.prefix ?? ''}${translatedText}${segment.suffix ?? ''}`;
}

/**
 * 合成中英对照块：用引用块（>）分别标注原文与译文。
 * 标题保留原始 `# Title` 行，再附上对照，避免目录跳转锚点丢失。
 */
function composeBilingualBlock(segment: MarkdownSegment, translatedText: string): string {
  const originalBlock = `> 原文\n> ${segment.translatableText}`;
  const translatedBlock = `> 译文\n> ${translatedText}`;

  if (segment.kind === 'heading') {
    return `${segment.raw}\n\n${originalBlock}\n\n${translatedBlock}`;
  }

  return `${originalBlock}\n\n${translatedBlock}`;
}

/**
 * 合成最终 Markdown 文本。
 *
 * @param params.segments 分段结果
 * @param params.results  适配器返回的翻译结果
 * @param params.outputMode 输出模式
 * @returns 合成后的 Markdown 字符串
 */
export function composeOutput(params: ComposeOutputParams): string {
  const resultMap = mapResultsBySegmentId(params.results);

  return params.segments
    .map((segment) => {
      // 锁定片段：代码块、HTML 块、空行，原样回填
      if (segment.locked) {
        return segment.raw;
      }

      // 找不到翻译结果时（理论上不应发生）兜底回原文，避免输出空洞
      const result = resultMap.get(segment.id);
      const translatedText = result?.translatedText ?? segment.translatableText;

      if (params.outputMode === 'bilingual') {
        return composeBilingualBlock(segment, translatedText);
      }

      return composeTranslatedLine(segment, translatedText);
    })
    .join('\n');
}
