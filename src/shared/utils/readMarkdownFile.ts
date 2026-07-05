/**
 * Markdown 文件读取工具。
 *
 * 在读取前校验扩展名，非法类型直接抛错；
 * 通过 `File.text()` 异步读取，调用方负责 try/catch 并向用户反馈。
 */

import { MARKDOWN_FILE_EXTENSIONS } from '@/shared/constants/file.constants';

/** 判断文件名是否为受支持的 Markdown 类型（不区分大小写）。 */
function isMarkdownFile(file: File): boolean {
  const normalizedName = file.name.toLowerCase();
  return MARKDOWN_FILE_EXTENSIONS.some((extension) => normalizedName.endsWith(extension));
}

/**
 * 读取 Markdown 文件为文本。
 *
 * @param file 用户选择的文件
 * @returns 文件文本内容
 * @throws 当文件扩展名不受支持时抛出 `Unsupported markdown file type`
 */
export async function readMarkdownFile(file: File): Promise<string> {
  if (!isMarkdownFile(file)) {
    throw new Error('Unsupported markdown file type');
  }

  return file.text();
}
