<script setup lang="ts">
/**
 * 通用空状态组件。
 *
 * 在结果区无内容、列表无数据等场景统一使用，
 * 通过 description 描述具体语义，避免多处重复实现。
 */

interface Props {
  /** 空状态描述文案。 */
  description: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="flex h-full min-h-48 items-center justify-center rounded border border-dashed border-slate-300 bg-white"
  >
    <a-empty :description="description" />
  </div>
</template>
