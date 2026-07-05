<script setup lang="ts">
/**
 * 输入区：展示并编辑 Markdown 源文本。
 *
 * 通过 v-model 与父级 state.source 双向绑定，
 * 不直接参与转换流程。
 */

interface Props {
  modelValue: string;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// a-textarea 的 update:value 事件携带最新字符串值（ant-design-vue v-model:value 协议）
function updateValue(value: string): void {
  emit('update:modelValue', value);
}
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-sm">
    <header class="border-b border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
      输入 Markdown
    </header>
    <a-textarea
      :value="modelValue"
      class="min-h-0 flex-1 resize-none border-0 font-mono text-sm"
      placeholder="粘贴 Markdown 内容，或点击导入 .md"
      @update:value="updateValue"
    />
  </section>
</template>
