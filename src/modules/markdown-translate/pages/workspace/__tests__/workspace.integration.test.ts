import { flushPromises, mount } from '@vue/test-utils';
import type { App } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import { registerUiProvider } from '@/app/providers/ui.provider';
import WorkspacePage from '../index.vue';

/**
 * 用真实的 registerUiProvider 注册（而非全量 Antd 插件），
 * 复现 dev 环境的组件注册面，捕获「漏注册组件」类 bug。
 *
 * 默认 translator 为 free（MyMemory），因此 stub fetch 模拟响应，
 * 避免单测依赖真实网络。
 */

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      responseStatus: 200,
      responseDetails: '',
      responseData: { translatedText: '模拟译文', match: 0.85 },
    }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockReset();
});

const mountWorkspace = () =>
  mount(WorkspacePage, {
    global: {
      plugins: [
        {
          install(app: App) {
            registerUiProvider(app);
          },
        },
      ],
    },
  });

describe('WorkspacePage (integration, real provider)', () => {
  it('renders toolbar and initial empty result', () => {
    const wrapper = mountWorkspace();

    const labels = wrapper.findAll('button').map((b) => b.text());
    expect(labels.some((t) => t.includes('开始转换'))).toBe(true);
    expect(wrapper.html()).toContain('等待转换');
  });

  it('produces translation after clicking convert', async () => {
    const wrapper = mountWorkspace();

    const convertButton = wrapper
      .findAll('button')
      .find((b) => b.text().includes('开始转换'));

    expect(convertButton).toBeTruthy();
    await convertButton!.trigger('click');
    // 排空 freeTranslator 多层 await（fetch → json → 并发批处理）+ 响应式刷新
    await flushPromises();
    await nextTick();

    // freeTranslator 解析 stub 响应得到「模拟译文」，应渲染到结果区
    expect(wrapper.html()).toContain('模拟译文');
    expect(mockFetch).toHaveBeenCalled();
  });
});
