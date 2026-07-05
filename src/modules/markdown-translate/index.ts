/**
 * Markdown 翻译模块的对外统一出口（Barrel）。
 *
 * 上层（app/router）只从此处导入，避免依赖模块内部路径，
 * 后续模块内部重构不会影响外部引用。
 */

export { markdownTranslateRoutes } from './routes';
