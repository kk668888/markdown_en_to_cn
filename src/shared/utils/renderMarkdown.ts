/**
 * Markdown 渲染工具。
 *
 * 基于 markdown-it（轻量、成熟、插件生态丰富），把 Markdown 字符串渲染为 HTML 字符串，
 * 供 ResultSection 的「预览」tab 通过 v-html 展示。
 *
 * 安全策略（重要）：
 *   - `html: false`：禁止原始 HTML 标签注入，所有 < > 都会被转义，从源头杜绝 XSS。
 *   - 外部链接统一加 `target="_blank" rel="noopener noreferrer"`，避免 reverse tabnabbing。
 *
 * 性能：renderer 为模块级单例，多次渲染复用同一实例，避免重复构造。
 */

import MarkdownIt from 'markdown-it';

const renderer = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: false,
});

// 让所有外链在新标签打开并防止 reverse tabnabbing；内部锚点保持默认行为
renderer.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx];
  if (token && token.attrIndex('target') < 0) {
    token.attrPush(['target', '_blank']);
    token.attrPush(['rel', 'noopener noreferrer']);
  }
  return self.renderToken(tokens, idx, options);
};

/**
 * 把 Markdown 渲染为 HTML 字符串。
 *
 * @param source Markdown 文本（为 null/undefined 时按空串处理）
 * @returns 渲染后的 HTML（已转义危险字符，可安全 v-html）
 */
export function renderMarkdown(source: string): string {
  return renderer.render(source ?? '');
}
