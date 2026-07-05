import { describe, expect, it } from 'vitest';

import { buildTranslationJobs } from '../buildTranslationJobs';
import { segmentMarkdown } from '../segmentMarkdown';

describe('segmentMarkdown', () => {
  it('locks fenced code blocks and keeps them out of translation jobs', () => {
    // 注意：segment id 采用「数组位置连续编号」，因此 paragraph 落在 seg-5
    const segments = segmentMarkdown('# Title\n\n```ts\nconst count = 1;\n```\n\nHello world.');

    expect(segments.some((segment) => segment.kind === 'code' && segment.locked)).toBe(true);
    expect(buildTranslationJobs(segments)).toEqual([
      { segmentId: 'seg-1', sourceText: 'Title' },
      { segmentId: 'seg-5', sourceText: 'Hello world.' },
    ]);
  });

  it('detects headings, blockquotes, lists, paragraphs, and empty lines', () => {
    const segments = segmentMarkdown('# Title\n\n> Quote\n\n- Item\n\nPlain paragraph');

    expect(segments.map((segment) => segment.kind)).toEqual([
      'heading',
      'empty',
      'blockquote',
      'empty',
      'list',
      'empty',
      'paragraph',
    ]);
  });

  it('keeps inline code inside translatable text markers', () => {
    const segments = segmentMarkdown('Use `const value = 1` in examples.');

    expect(segments[0]).toMatchObject({
      kind: 'paragraph',
      translatableText: 'Use `const value = 1` in examples.',
      locked: false,
    });
  });

  it('locks unclosed fenced code blocks as a single code segment', () => {
    // 边界用例：fence 未闭合，不应让后续行被当作普通段落参与翻译
    const segments = segmentMarkdown('Intro\n\n```ts\nconst leaked = 1;\nstill in fence');

    expect(segments).toEqual([
      expect.objectContaining({ id: 'seg-1', kind: 'paragraph', locked: false }),
      expect.objectContaining({ id: 'seg-2', kind: 'empty', locked: true }),
      expect.objectContaining({ id: 'seg-3', kind: 'code', locked: true }),
    ]);
    expect(buildTranslationJobs(segments)).toEqual([{ segmentId: 'seg-1', sourceText: 'Intro' }]);
  });
});
