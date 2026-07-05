export type AppTranslateDirection = 'en-to-zh' | 'zh-to-en';
export type AppOutputMode = 'translated-only' | 'bilingual';

export interface AppConfig {
  title: string;
  defaultDirection: AppTranslateDirection;
  defaultOutputMode: AppOutputMode;
}

export const appConfig: AppConfig = {
  title: 'Markdown 中英文转换工具',
  defaultDirection: 'en-to-zh',
  defaultOutputMode: 'translated-only',
};
