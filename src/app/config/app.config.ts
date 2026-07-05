/**
 * 应用级配置。
 *
 * 把「默认方向 / 默认输出模式 / 标题」这类启动期常量集中托管。
 * 类型直接复用模块领域类型，避免在 app 层重复声明字面量联合类型。
 */

import type {
  OutputMode,
  TranslateDirection,
} from '@/modules/markdown-translate/model/markdown.types';

export interface AppConfig {
  title: string;
  defaultDirection: TranslateDirection;
  defaultOutputMode: OutputMode;
}

export const appConfig: AppConfig = {
  title: 'Markdown 中英文转换工具',
  defaultDirection: 'en-to-zh',
  defaultOutputMode: 'translated-only',
};
