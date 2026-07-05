/**
 * 应用路由装配。
 *
 * 只做「聚合各模块路由 + 创建 router 实例」，
 * 具体路由定义下沉到各业务模块的 routes.ts，保持 app 层稳定。
 */

import { createRouter, createWebHistory } from 'vue-router';

import { markdownTranslateRoutes } from '@/modules/markdown-translate/routes';

export const router = createRouter({
  history: createWebHistory(),
  routes: [...markdownTranslateRoutes],
});
