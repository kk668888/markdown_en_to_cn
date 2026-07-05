<script setup lang="ts">
/**
 * 结果区：以「Markdown 源码 / 预览」两种视图展示合成结果。
 *
 * 状态分支：
 *   - errorMessage 非空 → 显示错误条
 *   - result 为空 → 显示空状态
 *   - 正常 → 显示源码 / 预览 Tab
 *
 * 预览采用纯文本排版（whitespace-pre-wrap），首版不引入 Markdown 渲染依赖；
 * 若后续需要渲染富文本，可在此处接入 markdown-it（见计划 Self-Review 风险说明）。
 */

import BaseEmpty from '@/shared/components/BaseEmpty.vue';
import BaseError from '@/shared/components/BaseError.vue';

interface Props {
  result: string;
  errorMessage: string;
}

defineProps<Props>();
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-sm">
    <header class="border-b border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
      输出结果
    </header>

    <div class="flex-1 overflow-hidden p-4">
      <BaseError v-if="errorMessage" :message="errorMessage" />
      <BaseEmpty v-else-if="!result" description="等待转换" />
      <a-tabs v-else class="h-full" size="small">
        <a-tab-pane key="source" tab="Markdown 源码">
          <pre
            class="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-50"
          >{{ result }}</pre>
        </a-tab-pane>
        <a-tab-pane key="preview" tab="预览">
          <article
            class="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded border border-slate-200 p-4 text-sm leading-relaxed text-slate-800"
          >{{ result }}</article>
        </a-tab-pane>
      </a-tabs>
    </div>
  </section>
</template>
