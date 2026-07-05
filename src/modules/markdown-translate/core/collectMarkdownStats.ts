/**
 * 文档统计：从原始内容与分段结果计算状态栏需要的指标。
 *
 * 全部基于纯数据，无副作用，便于测试。
 */

import type { MarkdownSegment, MarkdownStats } from '../model/markdown.types';

interface StatsAccumulator {
  translatableBlocks: number;
  skippedBlocks: number;
}

/** 遍历分段，按可翻译 / 跳过两类计数。 */
function countBlocks(segments: MarkdownSegment[]): StatsAccumulator {
  return segments.reduce<StatsAccumulator>(
    (acc, segment) => {
      // 非锁定且文本非空 → 可翻译
      if (!segment.locked && segment.translatableText.trim().length > 0) {
        return { ...acc, translatableBlocks: acc.translatableBlocks + 1 };
      }

      // 锁定但非空行（代码块、HTML 块）→ 跳过；空行不计入跳过，避免噪音
      if (segment.locked && segment.kind !== 'empty') {
        return { ...acc, skippedBlocks: acc.skippedBlocks + 1 };
      }

      return acc;
    },
    { translatableBlocks: 0, skippedBlocks: 0 },
  );
}

/**
 * 计算文档统计指标。
 *
 * @param content 原始 Markdown 文本（用于字符数与行数）
 * @param segments 分段结果（用于块级计数）
 * @returns 统计指标
 */
export function collectMarkdownStats(
  content: string,
  segments: MarkdownSegment[],
): MarkdownStats {
  const { translatableBlocks, skippedBlocks } = countBlocks(segments);

  return {
    characters: content.length,
    lines: content.length === 0 ? 0 : content.split(/\r?\n/).length,
    translatableBlocks,
    skippedBlocks,
  };
}
