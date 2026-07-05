import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { freeTranslator } from '../freeTranslator';

/**
 * freeTranslator 单元测试。
 *
 * 通过 stub 全局 fetch 模拟 MyMemory 响应，
 * 不依赖真实网络，保证测试稳定可重复。
 */

const mockFetch = vi.fn();
const okResponse = (body: unknown) => ({
  ok: true,
  json: async () => body,
});

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockReset();
});

describe('freeTranslator', () => {
  it('translates en->zh by calling MyMemory and parsing translatedText', async () => {
    mockFetch.mockResolvedValue(
      okResponse({
        responseStatus: 200,
        responseDetails: '',
        responseData: { translatedText: '你好', match: 0.85 },
      }),
    );

    const results = await freeTranslator.translate({
      direction: 'en-to-zh',
      jobs: [{ segmentId: 'seg-1', sourceText: 'Hello' }],
    });

    expect(results).toEqual([
      { segmentId: 'seg-1', sourceText: 'Hello', translatedText: '你好' },
    ]);
    // URL 中应携带正确的 langpair
    const calledUrl = String(mockFetch.mock.calls[0]?.[0]);
    expect(calledUrl).toContain('langpair=en%7Czh-CN');
    expect(calledUrl).toContain('q=Hello');
  });

  it('rejects zh->en with a friendly Chinese message without calling the API', async () => {
    await expect(
      freeTranslator.translate({
        direction: 'zh-to-en',
        jobs: [{ segmentId: 'seg-1', sourceText: '你好' }],
      }),
    ).rejects.toThrow(/中文/);

    // 不应发出任何网络请求
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('propagates a server-side error as a readable message', async () => {
    mockFetch.mockResolvedValue(
      okResponse({
        responseStatus: 403,
        responseDetails: 'REQUEST NOT VALID',
        responseData: null,
      }),
    );

    await expect(
      freeTranslator.translate({
        direction: 'en-to-zh',
        jobs: [{ segmentId: 'seg-1', sourceText: 'Hello' }],
      }),
    ).rejects.toThrow(/REQUEST NOT VALID/);
  });

  it('splits long text into chunks within the query length limit', async () => {
    // 每次调用返回拼接用的片段标记，便于断言切分次数
    let callIndex = 0;
    mockFetch.mockImplementation(async () => {
      callIndex += 1;
      return okResponse({
        responseStatus: 200,
        responseDetails: '',
        responseData: { translatedText: `[${callIndex}]`, match: 0 },
      });
    });

    // 600 字符的英文文本，预期被切成至少 2 段
    const longText = 'Hello world. '.repeat(50);
    const results = await freeTranslator.translate({
      direction: 'en-to-zh',
      jobs: [{ segmentId: 'seg-1', sourceText: longText }],
    });

    expect(results).toHaveLength(1);
    expect(mockFetch.mock.calls.length).toBeGreaterThan(1);
    // 每个 q 参数都应不超过 480 字符（URL 解码后）
    for (const call of mockFetch.mock.calls) {
      const url = String(call[0]);
      const q = new URL(url).searchParams.get('q') ?? '';
      expect(q.length).toBeLessThanOrEqual(480);
    }
  });
});
