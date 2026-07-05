/**
 * 文件相关常量。
 *
 * 集中托管「允许的扩展名 / MIME / 默认下载文件名」，
 * 校验与下载逻辑统一引用，避免散落多处硬编码。
 */

/** 允许导入的 Markdown 文件扩展名。 */
export const MARKDOWN_FILE_EXTENSIONS = ['.md', '.markdown'] as const;

/**
 * 接受的 MIME 类型。
 * 浏览器对 `.md` 文件的识别不统一，因此同时放行 `text/plain` 作为兜底。
 */
export const MARKDOWN_MIME_TYPES = ['text/markdown', 'text/plain'] as const;

/** 下载译文时的默认文件名。 */
export const DEFAULT_DOWNLOAD_FILE_NAME = 'translated-markdown.md';
