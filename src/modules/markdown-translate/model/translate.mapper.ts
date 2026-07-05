/**
 * 翻译结果的映射工具。
 *
 * 适配器返回的是数组，而合成输出需要按 segmentId 快速查找，
 * 因此提供一个一次性构建 Map 的纯函数，避免在合成阶段反复线性扫描。
 */

import type { TranslationResult } from './markdown.types';

/**
 * 将翻译结果数组转换为以 segmentId 为键的 Map。
 *
 * @param results 适配器返回的翻译结果列表
 * @returns Map<segmentId, TranslationResult>
 */
export function mapResultsBySegmentId(results: TranslationResult[]): Map<string, TranslationResult> {
  return new Map(results.map((result) => [result.segmentId, result]));
}
