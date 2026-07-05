/**
 * 翻译适配器接口契约。
 *
 * 适配器层（adapters/）是「核心业务」与「具体翻译服务」之间的隔离层：
 *   - core/ 与 pages/ 只依赖此接口，不感知是 Mock、OpenAI、DeepL 还是内网网关。
 *   - 新增引擎只需实现该接口并注入，无需改动上游。
 *
 * 这是不变性最强的一层，类型定义保持稳定可大幅降低后续替换成本。
 */

import type {
  TranslateDirection,
  TranslationJob,
  TranslationResult,
} from '../model/markdown.types';

/** 适配器调用入参：方向 + 任务列表。 */
export interface TranslateParams {
  direction: TranslateDirection;
  jobs: TranslationJob[];
}

/**
 * 翻译适配器接口。
 * 实现方需保证：返回结果与入参 jobs 一一对应（按 segmentId 关联）。
 */
export interface TranslatorAdapter {
  translate(params: TranslateParams): Promise<TranslationResult[]>;
}
