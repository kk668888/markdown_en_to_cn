import { mount } from '@vue/test-utils';
import type { App } from 'vue';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import { registerUiProvider } from '@/app/providers/ui.provider';
import WorkspacePage from '../index.vue';

/**
 * 用真实的 registerUiProvider 注册（而非全量 Antd 插件），
 * 复现 dev 环境的组件注册面，捕获「漏注册组件」类 bug。
 */
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

  it('produces [ZH MOCK] translation after clicking convert', async () => {
    const wrapper = mountWorkspace();

    const convertButton = wrapper
      .findAll('button')
      .find((b) => b.text().includes('开始转换'));

    expect(convertButton).toBeTruthy();
    await convertButton!.trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.html()).toContain('[ZH MOCK]');
  });
});
