<script setup lang="ts">
/**
 * 通用错误展示组件。
 *
 * 仅负责把 errorMessage 以可读样式渲染出来，
 * 不承载复杂判断；错误分类与文案在 composable 层完成。
 */

interface Props {
  /** 错误消息。 */
  message: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    role="alert"
  >
    {{ message }}
  </div>
</template>
