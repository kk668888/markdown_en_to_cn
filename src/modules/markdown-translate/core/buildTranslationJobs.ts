/**
 * 翻译任务构建器。
 *
 * 从分段结果中筛除「锁定片段」与「可翻译文本为空」的片段，
 * 只保留真正需要交给翻译引擎的内容，避免无效请求。
 */

import type { MarkdownSegment, TranslationJob } from '../model/markdown.types';

/**
 * 根据分段结果构建翻译任务列表。
 *
 * 过滤规则：
 *   1. `locked === true`（代码块、HTML 块、空行）→ 跳过。
 *   2. `translatableText` 去除首尾空白后为空 → 跳过。
 *
 * @param segments segmentMarkdown 的输出
 * @returns 进入翻译引擎的任务数组
 */
export function buildTranslationJobs(segments: MarkdownSegment[]): TranslationJob[] {
  return segments
    .filter((segment) => !segment.locked && segment.translatableText.trim().length > 0)
    .map((segment) => ({
      segmentId: segment.id,
      sourceText: segment.translatableText,
    }));
}
