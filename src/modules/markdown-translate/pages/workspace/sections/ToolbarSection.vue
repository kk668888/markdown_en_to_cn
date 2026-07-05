<script setup lang="ts">
/**
 * 工具栏：导入文件、切换方向 / 输出模式、触发转换 / 复制 / 下载。
 *
 * 仅做交互编排，所有状态都通过 props 进、emits 出，
 * 不持有业务状态，便于复用与测试。
 */

import { computed } from 'vue';

import { OUTPUT_MODE_OPTIONS, TRANSLATE_DIRECTION_OPTIONS } from '../../../model/translate.constants';
import type {
  OutputMode,
  TranslateDirection,
  WorkspaceStatus,
} from '../../../model/markdown.types';

interface Props {
  direction: TranslateDirection;
  outputMode: OutputMode;
  status: WorkspaceStatus;
  hasResult: boolean;
  canConvert: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:direction': [value: TranslateDirection];
  'update:outputMode': [value: OutputMode];
  import: [file: File];
  convert: [];
  copy: [];
  download: [];
}>();

// parsing / translating 期间禁用按钮并显示 loading
const isBusy = computed(() => props.status === 'parsing' || props.status === 'translating');

// a-select 的 change 第一个参数是选中值，用 unknown 收敛后断言为联合类型
function updateDirection(value: unknown): void {
  emit('update:direction', value as TranslateDirection);
}

// a-radio-group 的 change 事件携带 target.value
function updateOutputMode(event: Event): void {
  const target = event.target as HTMLInputElement;
  emit('update:outputMode', target.value as OutputMode);
}

function handleFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    emit('import', file);
  }
  // 清空 input 的值，否则连续选择同一个文件不会触发 change
  input.value = '';
}
</script>

<template>
  <section class="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
    <label
      class="inline-flex cursor-pointer items-center rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
    >
      导入 .md
      <input class="hidden" type="file" accept=".md,.markdown" @change="handleFileChange" />
    </label>

    <a-select
      :value="direction"
      class="w-40"
      :options="TRANSLATE_DIRECTION_OPTIONS"
      @change="updateDirection"
    />

    <a-radio-group
      :value="outputMode"
      option-type="button"
      :options="OUTPUT_MODE_OPTIONS"
      @change="updateOutputMode"
    />

    <a-button type="primary" :loading="isBusy" :disabled="!canConvert" @click="emit('convert')">
      开始转换
    </a-button>

    <div class="ml-auto flex gap-2">
      <a-button :disabled="!hasResult" @click="emit('copy')">复制</a-button>
      <a-button :disabled="!hasResult" @click="emit('download')">下载 .md</a-button>
    </div>
  </section>
</template>
