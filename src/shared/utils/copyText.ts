/**
 * 剪贴板复制工具。
 *
 * 使用现代 Clipboard API（`navigator.clipboard.writeText`），
 * 仅在 HTTPS 或 localhost 下可用；不可用时抛出明确错误，
 * 由调用方（composable）转换为用户可理解的提示。
 */

/**
 * 将文本写入系统剪贴板。
 *
 * @param text 待复制文本
 * @throws 当 Clipboard API 不可用或写入被拒绝时抛出
 */
export async function copyText(text: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API is unavailable');
  }

  await navigator.clipboard.writeText(text);
}
