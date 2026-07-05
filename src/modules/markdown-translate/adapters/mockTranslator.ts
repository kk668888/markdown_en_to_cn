/**
 * Mock 翻译适配器。
 *
 * 不调用任何真实翻译服务，只在原文前加 `[ZH MOCK]` / `[EN MOCK]` 前缀。
 * 用途：在接入真实引擎前，验证分段 / 翻译 / 合成的全链路流程与 Markdown 保真。
 * 后续真实引擎（openAiTranslator / deepLTranslator / intranetTranslator）只需
 * 实现相同的 TranslatorAdapter 接口即可平滑替换。
 */

import type { TranslateDirection } from '../model/markdown.types';
import type { TranslatorAdapter } from './translator.types';

/** 按方向选择前缀，便于在输出中肉眼区分译文来源。 */
function pickPrefix(direction: TranslateDirection): string {
  return direction === 'en-to-zh' ? '[ZH MOCK]' : '[EN MOCK]';
}

export const mockTranslator: TranslatorAdapter = {
  async translate(params) {
    const prefix = pickPrefix(params.direction);

    return params.jobs.map((job) => ({
      segmentId: job.segmentId,
      sourceText: job.sourceText,
      translatedText: `${prefix} ${job.sourceText}`,
    }));
  },
};
