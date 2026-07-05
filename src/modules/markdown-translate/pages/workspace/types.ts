/**
 * 工作区页面状态类型。
 *
 * 仅描述「页面运行期」的可变状态结构，由 useMarkdownWorkspace 创建并维护，
 * 通过 props 向下传递给各 section 组件。
 */

import type {
  MarkdownStats,
  OutputMode,
  TranslateDirection,
  WorkspaceStatus,
} from '../../model/markdown.types';

export interface WorkspaceState {
  /** 输入 Markdown。 */
  source: string;
  /** 输出 Markdown（合成结果）。 */
  result: string;
  /** 翻译方向。 */
  direction: TranslateDirection;
  /** 输出模式。 */
  outputMode: OutputMode;
  /** 当前状态机节点。 */
  status: WorkspaceStatus;
  /** 错误信息（为空表示无错误）。 */
  errorMessage: string;
  /** 文档统计。 */
  stats: MarkdownStats;
  /** 上一次转换耗时（毫秒）。 */
  elapsedMs: number;
}
