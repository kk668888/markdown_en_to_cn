<script setup lang="ts">
/**
 * 结果区：以「Markdown 源码 / 预览」两种视图展示合成结果。
 *
 * 状态分支：
 *   - errorMessage 非空 → 显示错误条
 *   - result 为空 → 显示空状态
 *   - 正常 → 显示源码 / 预览 Tab
 *
 * 预览：用 markdown-it 把结果渲染为 HTML 后 v-html 展示（renderMarkdown 内部 html:false，
 * 已转义危险字符，避免 XSS）。样式来自全局 .markdown-preview（见 shared/styles/markdown.css）。
 */

import { computed } from 'vue';

import BaseEmpty from '@/shared/components/BaseEmpty.vue';
import BaseError from '@/shared/components/BaseError.vue';
import { renderMarkdown } from '@/shared/utils/renderMarkdown';

interface Props {
  result: string;
  errorMessage: string;
}

const props = defineProps<Props>();

// 把 Markdown 结果渲染为 HTML；computed 缓存，result 不变时不重复渲染
const renderedHtml = computed(() => renderMarkdown(props.result));
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
          <!-- v-html 内容由 renderMarkdown 生成，html:false 已防 XSS -->
          <article class="markdown-preview max-h-[60vh] overflow-auto p-1" v-html="renderedHtml" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </section>
</template>
