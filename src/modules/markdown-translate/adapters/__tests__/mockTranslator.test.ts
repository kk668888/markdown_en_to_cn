import { describe, expect, it } from 'vitest';

import { mockTranslator } from '../mockTranslator';

describe('mockTranslator', () => {
  it('prefixes English to Chinese results with ZH MOCK', async () => {
    await expect(
      mockTranslator.translate({
        direction: 'en-to-zh',
        jobs: [{ segmentId: 'seg-1', sourceText: 'Hello world' }],
      }),
    ).resolves.toEqual([
      { segmentId: 'seg-1', sourceText: 'Hello world', translatedText: '[ZH MOCK] Hello world' },
    ]);
  });

  it('prefixes Chinese to English results with EN MOCK', async () => {
    await expect(
      mockTranslator.translate({
        direction: 'zh-to-en',
        jobs: [{ segmentId: 'seg-1', sourceText: '你好' }],
      }),
    ).resolves.toEqual([
      { segmentId: 'seg-1', sourceText: '你好', translatedText: '[EN MOCK] 你好' },
    ]);
  });

  it('returns an empty array when there are no jobs', async () => {
    await expect(
      mockTranslator.translate({ direction: 'en-to-zh', jobs: [] }),
    ).resolves.toEqual([]);
  });
});
