/**
 * Markdown 翻译模块的核心领域类型定义。
 *
 * 这些类型是「纯数据契约」，不依赖 Vue、DOM 或任何具体翻译服务，
 * 因此可以被 core/、adapters/、pages/ 各层无差别复用，也便于单元测试。
 */

/** 翻译方向：英文 → 中文 / 中文 → 英文。 */
export type TranslateDirection = 'en-to-zh' | 'zh-to-en';

/** 输出模式：纯译文 / 中英对照。 */
export type OutputMode = 'translated-only' | 'bilingual';

/**
 * 工作区状态机：
 *   idle → parsing → translating → completed
 * 任意阶段异常进入 failed。
 */
export type WorkspaceStatus = 'idle' | 'parsing' | 'translating' | 'completed' | 'failed';

/**
 * Markdown 片段种类。
 * - code / html / empty：锁定，不参与翻译。
 * - 其余：可翻译文本片段。
 */
export type MarkdownSegmentKind =
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'table-cell'
  | 'blockquote'
  | 'code'
  | 'html'
  | 'empty';

/** 源文档：承载输入内容与可选的文件名。 */
export interface SourceDocument {
  fileName?: string;
  content: string;
  updatedAt: number;
}

/**
 * Markdown 分段结果。
 * - `raw`：原始文本（用于锁定片段原样回填）。
 * - `translatableText`：可翻译部分（标题/列表/引用已剥离前缀）。
 * - `prefix` / `suffix`：Markdown 结构前缀（如 `# `、`> `、`- `），合成输出时拼回。
 * - `locked`：为 true 时跳过翻译，直接回填 raw。
 */
export interface MarkdownSegment {
  id: string;
  kind: MarkdownSegmentKind;
  raw: string;
  translatableText: string;
  locked: boolean;
  prefix?: string;
  suffix?: string;
}

/** 翻译任务：交给适配器的最小输入单元。 */
export interface TranslationJob {
  segmentId: string;
  sourceText: string;
}

/** 翻译结果：适配器返回，带原文便于回填与对照。 */
export interface TranslationResult {
  segmentId: string;
  sourceText: string;
  translatedText: string;
}

/** 文档统计指标，用于状态栏展示。 */
export interface MarkdownStats {
  /** 输入字符数（按原始字符串长度计算）。 */
  characters: number;
  /** 输入行数（按换行分割）。 */
  lines: number;
  /** 可翻译块数量（非锁定且内容非空）。 */
  translatableBlocks: number;
  /** 跳过块数量（锁定的非空块，如代码块、HTML 块）。 */
  skippedBlocks: number;
}
