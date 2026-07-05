/**
 * 免费翻译适配器（基于 MyMemory 公共接口）。
 *
 * 选型理由：
 *   - 免 Key，浏览器直调（响应头带 CORS），适合「本地优先」的纯前端工具。
 *   - 有免费日额度（默认 5000 词/天，匿名调用）。
 *
 * 已知限制（已在接口层显式处理，避免用户看到原始错误）：
 *   - MyMemory 不支持「中文作为源语言」，因此 中文→英文 方向不可用。
 *     adapter 在入口直接抛出中文友好提示；后续如需双向，应接入 OpenAI / DeepL adapter。
 *   - 单次请求 q 限制约 500 字符，超长文本会沿句末/换行切分后逐段翻译再拼接。
 *
 * 设计与 mockTranslator 一致：实现同一个 TranslatorAdapter 接口，
 * core / UI 层无感知，可平滑替换。
 */

import type { TranslateDirection } from '../model/markdown.types';
import type { TranslatorAdapter } from './translator.types';

/** 翻译方向到 MyMemory langpair 的映射。 */
interface LangPair {
  source: string;
  target: string;
}

const DIRECTION_TO_LANGPAIR: Record<TranslateDirection, LangPair> = {
  'en-to-zh': { source: 'en', target: 'zh-CN' },
  'zh-to-en': { source: 'zh', target: 'en' },
};

const ENDPOINT = 'https://api.mymemory.translated.net/get';

/** MyMemory 单次请求 q 字符上限（保留余量）。 */
const MAX_QUERY_LENGTH = 480;

/** 并发翻译上限，避免触发 MyMemory 限流（实测并发过高会被短时拒绝）。 */
const MAX_CONCURRENCY = 4;

/** MyMemory 响应结构（只声明我们用到的字段）。 */
interface MyMemoryResponse {
  responseData: { translatedText: string; match: number } | null;
  responseStatus: number;
  responseDetails: string;
}

/**
 * 把超长文本切成不超过上限的片段，尽量沿句末标点或换行切，
 * 避免从句子中间切断影响翻译质量。
 */
function chunkText(text: string): string[] {
  if (text.length <= MAX_QUERY_LENGTH) {
    return [text];
  }

  const chunks: string[] = [];
  // 命中句末（中英文标点）或换行后拆分
  const sentences = text.split(/(?<=[.!?\n。！？])/);
  let current = '';

  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_QUERY_LENGTH) {
      if (current) {
        chunks.push(current);
      }
      // 单句就超长时硬切，保证不丢内容
      if (sentence.length > MAX_QUERY_LENGTH) {
        for (let i = 0; i < sentence.length; i += MAX_QUERY_LENGTH) {
          chunks.push(sentence.slice(i, i + MAX_QUERY_LENGTH));
        }
        current = '';
      } else {
        current = sentence;
      }
    } else {
      current += sentence;
    }
  }
  if (current) {
    chunks.push(current);
  }
  return chunks;
}

/** 单次调用 MyMemory 翻译一段不超过上限的文本。 */
async function callMyMemory(text: string, pair: LangPair): Promise<string> {
  const url = new URL(ENDPOINT);
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', `${pair.source}|${pair.target}`);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`翻译服务请求失败（HTTP ${response.status}），请检查网络后重试`);
  }

  const data = (await response.json()) as MyMemoryResponse;
  if (data.responseStatus !== 200) {
    throw new Error(
      data.responseDetails || `翻译服务返回错误（状态 ${data.responseStatus}）`,
    );
  }
  const translated = data.responseData?.translatedText;
  if (!translated) {
    throw new Error('翻译服务未返回有效结果，请稍后重试');
  }
  return translated;
}

/** 翻译任意长度文本（自动切分 + 拼接）。 */
async function translateText(text: string, pair: LangPair): Promise<string> {
  const chunks = chunkText(text);
  const outputs: string[] = [];
  for (const chunk of chunks) {
    outputs.push(await callMyMemory(chunk, pair));
  }
  return outputs.join('');
}

/**
 * 分批并发执行：每批最多 limit 个任务并行，批与批之间串行。
 * 在「控制总并发」与「保持结果顺序」之间取得平衡。
 */
async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((item) => worker(item)));
    results.push(...batchResults);
  }
  return results;
}

export const freeTranslator: TranslatorAdapter = {
  async translate({ direction, jobs }) {
    const pair = DIRECTION_TO_LANGPAIR[direction];

    // MyMemory 不支持中文作源，提前给出中文友好提示，避免无效请求与原始报错外泄
    if (pair.source === 'zh') {
      throw new Error('当前免费翻译引擎（MyMemory）暂不支持「中文 → 英文」，请改用「英文 → 中文」方向。');
    }

    return mapWithConcurrency(jobs, MAX_CONCURRENCY, async (job) => ({
      segmentId: job.segmentId,
      sourceText: job.sourceText,
      translatedText: await translateText(job.sourceText, pair),
    }));
  },
};
