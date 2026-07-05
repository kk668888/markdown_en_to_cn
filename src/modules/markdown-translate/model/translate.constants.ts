/**
 * 翻译相关的展示常量。
 *
 * 把「枚举值」与「UI 文案」集中管理，组件层直接消费，
 * 避免在多处硬编码方向/模式选项导致维护漂移。
 */

import type { OutputMode, TranslateDirection } from './markdown.types';

/** 翻译方向下拉选项。 */
export const TRANSLATE_DIRECTION_OPTIONS: Array<{ label: string; value: TranslateDirection }> = [
  { label: '英文 -> 中文', value: 'en-to-zh' },
  { label: '中文 -> 英文', value: 'zh-to-en' },
];

/** 输出模式单选选项。 */
export const OUTPUT_MODE_OPTIONS: Array<{ label: string; value: OutputMode }> = [
  { label: '纯译文', value: 'translated-only' },
  { label: '中英对照', value: 'bilingual' },
];
