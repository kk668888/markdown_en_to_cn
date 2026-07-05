/**
 * Markdown 翻译模块的路由定义。
 *
 * 采用懒加载，首屏不引入页面 chunk，符合 Vite 的按需打包策略。
 * 模块对外只暴露路由数组，由 app/router 统一组装。
 */

import type { RouteRecordRaw } from 'vue-router';

export const markdownTranslateRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'MarkdownTranslateWorkspace',
    // 动态 import，构建时自动代码分割
    component: () => import('./pages/workspace/index.vue'),
  },
];
