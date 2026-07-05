import { describe, expect, it } from 'vitest';

import type { MarkdownSegment, TranslationResult } from '../../model/markdown.types';
import { composeOutput } from '../composeOutput';

const segments: MarkdownSegment[] = [
  {
    id: 'seg-1',
    kind: 'heading',
    raw: '# Title',
    prefix: '# ',
    translatableText: 'Title',
    locked: false,
  },
  { id: 'seg-2', kind: 'empty', raw: '', translatableText: '', locked: true },
  {
    id: 'seg-3',
    kind: 'code',
    raw: '```ts\nconst count = 1;\n```',
    translatableText: '',
    locked: true,
  },
];

const results: TranslationResult[] = [
  { segmentId: 'seg-1', sourceText: 'Title', translatedText: '[ZH MOCK] Title' },
];

describe('composeOutput', () => {
  it('creates translated-only markdown', () => {
    expect(composeOutput({ segments, results, outputMode: 'translated-only' })).toBe(
      '# [ZH MOCK] Title\n\n```ts\nconst count = 1;\n```',
    );
  });

  it('creates bilingual markdown', () => {
    expect(composeOutput({ segments, results, outputMode: 'bilingual' })).toBe(
      '# Title\n\n> 原文\n> Title\n\n> 译文\n> [ZH MOCK] Title\n\n```ts\nconst count = 1;\n```',
    );
  });
});
