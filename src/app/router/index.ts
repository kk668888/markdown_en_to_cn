import { defineComponent, h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { appConfig } from '@/app/config/app.config';

const PlaceholderWorkspacePage = defineComponent({
  name: 'PlaceholderWorkspacePage',
  setup() {
    return () =>
      h('main', { class: 'min-h-screen bg-slate-100 px-6 py-10 text-slate-900' }, [
        h('div', { class: 'mx-auto max-w-5xl rounded-lg bg-white p-8 shadow-sm' }, [
          h('h1', { class: 'text-2xl font-semibold' }, appConfig.title),
          h(
            'p',
            { class: 'mt-3 text-sm text-slate-600' },
            '应用壳、路由、UI Provider 与样式基线已完成，业务页面将在后续任务接入。',
          ),
        ]),
      ]);
  },
});

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'MarkdownTranslateWorkspace',
      component: PlaceholderWorkspacePage,
    },
  ],
});
