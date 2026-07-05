/**
 * 应用级配置。
 *
 * 把「默认方向 / 默认输出模式 / 翻译引擎 / 标题」这类启动期常量集中托管。
 * 类型直接复用模块领域类型，避免在 app 层重复声明字面量联合类型。
 */

import type {
  OutputMode,
  TranslateDirection,
} from '@/modules/markdown-translate/model/markdown.types';

/** 翻译引擎选择：免费在线（MyMemory）或 Mock（不联网，仅验证流程）。 */
export type TranslatorKind = 'free' | 'mock';

export interface AppConfig {
  title: string;
  defaultDirection: TranslateDirection;
  defaultOutputMode: OutputMode;
  /** 决定 useMarkdownWorkspace 解析到哪个 TranslatorAdapter。 */
  translator: TranslatorKind;
}

export const appConfig: AppConfig = {
  title: 'Markdown 中英文转换工具',
  defaultDirection: 'en-to-zh',
  defaultOutputMode: 'translated-only',
  // 默认走免费在线引擎；网络受限或离线时改为 'mock' 可继续验证流程
  translator: 'free',
};
