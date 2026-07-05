/**
 * 工作区编排 composable。
 *
 * 职责：
 *   1. 持有页面状态（输入 / 输出 / 方向 / 模式 / 状态机 / 统计 / 耗时）。
 *   2. 串起分段 → 构建任务 → 调用适配器 → 合成输出的核心流程。
 *   3. 把底层异常翻译为用户可理解的 errorMessage。
 *
 * 不直接操作 DOM，也不感知具体翻译引擎，便于单元测试与后续替换。
 */

import { computed, reactive } from 'vue';

import { appConfig } from '@/app/config/app.config';
import { copyText } from '@/shared/utils/copyText';
import { downloadMarkdown } from '@/shared/utils/downloadMarkdown';
import { readMarkdownFile } from '@/shared/utils/readMarkdownFile';

import { mockTranslator } from '../../../adapters/mockTranslator';
import { buildTranslationJobs } from '../../../core/buildTranslationJobs';
import { collectMarkdownStats } from '../../../core/collectMarkdownStats';
import { composeOutput } from '../../../core/composeOutput';
import { segmentMarkdown } from '../../../core/segmentMarkdown';
import { EXAMPLE_MARKDOWN } from '../constants';
import type { WorkspaceState } from '../types';

/** 初始统计指标，避免 undefined 渲染。 */
function createInitialStats() {
  return {
    characters: 0,
    lines: 0,
    translatableBlocks: 0,
    skippedBlocks: 0,
  };
}

export function useMarkdownWorkspace() {
  const state = reactive<WorkspaceState>({
    source: EXAMPLE_MARKDOWN,
    result: '',
    direction: appConfig.defaultDirection,
    outputMode: appConfig.defaultOutputMode,
    status: 'idle',
    errorMessage: '',
    stats: createInitialStats(),
    elapsedMs: 0,
  });

  // 输入为空或正在处理时不允许再次触发转换
  const canConvert = computed(
    () =>
      state.source.trim().length > 0 &&
      state.status !== 'parsing' &&
      state.status !== 'translating',
  );

  /**
   * 执行一次完整的转换流程：分段 → 统计 → 翻译 → 合成。
   * 任何阶段异常都进入 failed 状态并写入 errorMessage。
   */
  async function convertMarkdown(): Promise<void> {
    if (!state.source.trim()) {
      state.status = 'failed';
      state.errorMessage = '请先输入或导入 Markdown 内容';
      return;
    }

    const startedAt = performance.now();
    state.status = 'parsing';
    state.errorMessage = '';

    try {
      const segments = segmentMarkdown(state.source);
      const jobs = buildTranslationJobs(segments);
      state.stats = collectMarkdownStats(state.source, segments);

      if (jobs.length === 0) {
        state.status = 'failed';
        state.errorMessage = '未识别到可翻译文本，代码块和空内容会被跳过';
        return;
      }

      state.status = 'translating';
      const results = await mockTranslator.translate({ direction: state.direction, jobs });
      state.result = composeOutput({ segments, results, outputMode: state.outputMode });
      state.elapsedMs = Math.round(performance.now() - startedAt);
      state.status = 'completed';
    } catch (error) {
      console.error('[convertMarkdown]', error);
      state.status = 'failed';
      state.errorMessage = '转换失败，请稍后重试';
    }
  }

  /** 导入 .md / .markdown 文件，把内容写回输入区。 */
  async function importFile(file: File): Promise<void> {
    try {
      state.source = await readMarkdownFile(file);
      state.result = '';
      state.status = 'idle';
      state.errorMessage = '';
    } catch (error) {
      console.error('[importFile]', error);
      state.status = 'failed';
      state.errorMessage = '文件读取失败，请重新选择 .md 或 .markdown 文件';
    }
  }

  /** 复制结果到剪贴板；失败时给出可理解提示（不抛错到上层）。 */
  async function copyResult(): Promise<void> {
    try {
      await copyText(state.result);
    } catch (error) {
      console.error('[copyResult]', error);
      state.errorMessage = '浏览器限制了剪贴板访问，请手动复制';
    }
  }

  /** 下载当前结果为 .md 文件。 */
  function downloadResult(): void {
    downloadMarkdown(state.result);
  }

  return {
    state,
    canConvert,
    convertMarkdown,
    importFile,
    copyResult,
    downloadResult,
  };
}
