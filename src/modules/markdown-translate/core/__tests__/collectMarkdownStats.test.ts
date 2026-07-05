import { describe, expect, it } from 'vitest';

import { collectMarkdownStats } from '../collectMarkdownStats';
import { segmentMarkdown } from '../segmentMarkdown';

describe('collectMarkdownStats', () => {
  it('counts characters, lines, translatable blocks, and skipped blocks', () => {
    const segments = segmentMarkdown('# Title\n\n```ts\nconst value = 1;\n```\n\nText');

    // 语义说明：
    // - translatableBlocks：非锁定且内容非空 → 标题 + 段落 = 2
    // - skippedBlocks：锁定的非空块（代码块/HTML 块），空行不计 → 代码块 = 1
    expect(collectMarkdownStats('# Title\n\n```ts\nconst value = 1;\n```\n\nText', segments)).toEqual({
      characters: 41,
      lines: 7,
      translatableBlocks: 2,
      skippedBlocks: 1,
    });
  });
});
