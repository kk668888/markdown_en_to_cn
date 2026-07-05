/**
 * Markdown 文件下载工具。
 *
 * 通过 `Blob + ObjectURL + <a download>` 触发浏览器下载，
 * 无需后端参与；下载完成立即释放 ObjectURL，避免内存泄漏。
 */

import { DEFAULT_DOWNLOAD_FILE_NAME } from '@/shared/constants/file.constants';

/**
 * 触发浏览器下载一份 Markdown 文件。
 *
 * @param content 文件内容
 * @param fileName 文件名，默认 `translated-markdown.md`
 */
export function downloadMarkdown(content: string, fileName: string = DEFAULT_DOWNLOAD_FILE_NAME): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();

  // 释放 ObjectURL，避免在浏览器中累积 Blob 引用
  URL.revokeObjectURL(url);
}
