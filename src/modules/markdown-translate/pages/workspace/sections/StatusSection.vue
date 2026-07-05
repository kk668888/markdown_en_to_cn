<script setup lang="ts">
/**
 * 状态栏：展示状态机节点、统计指标与上一次转换耗时。
 *
 * 把内部状态枚举映射为中文文案，提升可读性。
 */

import { computed } from 'vue';

import type { MarkdownStats, WorkspaceStatus } from '../../../model/markdown.types';

interface Props {
  status: WorkspaceStatus;
  stats: MarkdownStats;
  elapsedMs: number;
}

const props = defineProps<Props>();

// 状态机节点到中文文案的映射表
const STATUS_LABEL: Record<WorkspaceStatus, string> = {
  idle: '就绪',
  parsing: '解析中',
  translating: '翻译中',
  completed: '已完成',
  failed: '失败',
};

const statusLabel = computed(() => STATUS_LABEL[props.status]);
</script>

<template>
  <footer
    class="flex flex-wrap gap-4 border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500"
  >
    <span>状态：{{ statusLabel }}</span>
    <span>字数：{{ stats.characters }}</span>
    <span>行数：{{ stats.lines }}</span>
    <span>可翻译块：{{ stats.translatableBlocks }}</span>
    <span>跳过块：{{ stats.skippedBlocks }}</span>
    <span>耗时：{{ elapsedMs }}ms</span>
  </footer>
</template>
