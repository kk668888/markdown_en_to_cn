<script setup lang="ts">
/**
 * 工作区页面：组装工具栏 / 输入区 / 结果区 / 状态栏。
 *
 * 页面只做布局与数据传递，复杂逻辑全部下沉到 useMarkdownWorkspace composable。
 */

import ResultSection from './sections/ResultSection.vue';
import SourceSection from './sections/SourceSection.vue';
import StatusSection from './sections/StatusSection.vue';
import ToolbarSection from './sections/ToolbarSection.vue';
import { useMarkdownWorkspace } from './composables/useMarkdownWorkspace';

const {
  state,
  canConvert,
  convertMarkdown,
  importFile,
  copyResult,
  downloadResult,
} = useMarkdownWorkspace();
</script>

<template>
  <main class="flex h-screen min-h-0 flex-col bg-slate-100">
    <header class="bg-white px-5 py-4 shadow-sm">
      <h1 class="text-xl font-semibold text-slate-900">Markdown 中英文转换工具</h1>
      <p class="mt-1 text-sm text-slate-500">
        本地优先 · 保留 Markdown 结构 · 支持纯译文 / 中英对照
      </p>
    </header>

    <ToolbarSection
      v-model:direction="state.direction"
      v-model:output-mode="state.outputMode"
      :status="state.status"
      :has-result="Boolean(state.result)"
      :can-convert="canConvert"
      @import="importFile"
      @convert="convertMarkdown"
      @copy="copyResult"
      @download="downloadResult"
    />

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-2">
      <SourceSection v-model="state.source" />
      <ResultSection :result="state.result" :error-message="state.errorMessage" />
    </div>

    <StatusSection :status="state.status" :stats="state.stats" :elapsed-ms="state.elapsedMs" />
  </main>
</template>
