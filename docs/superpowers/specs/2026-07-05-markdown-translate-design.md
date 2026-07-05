# Markdown Translate Web MVP Design

## 1. 背景与目标

本项目首版定位为 Markdown 翻译工具，而不是完整知识库或桌面编辑器。用户可以粘贴 Markdown 内容，或导入单个 `.md` 文件，选择翻译方向和输出模式后生成结果。

首版目标是验证三件事：

- Markdown 结构能否在转换后尽量保留。
- 纯译文和中英对照两种输出是否满足实际使用。
- 翻译引擎能否通过适配器替换，而不影响页面和核心流程。

## 2. 首版范围

必须支持：

- 粘贴 Markdown 文本。
- 导入单个 `.md` 或 `.markdown` 文件。
- 英文到中文、中文到英文两个方向。
- 纯译文 Markdown 输出。
- 中英对照 Markdown 输出。
- 输出源码和预览切换。
- 复制结果。
- 下载 `.md` 文件。
- Mock 翻译引擎。
- 跳过 fenced code block、行内 code、空内容。
- 保留标题、段落、列表、引用、普通表格的基本结构。

## 3. 非目标

首版不做：

- 批量目录翻译。
- 真实翻译 API。
- 术语库。
- 翻译记忆。
- 登录、云同步、协作。
- Electron 打包。
- 最近文件和本地项目管理。
- Markdown 富文本所见即所得编辑。

这些能力进入后续阶段，不进入 Web MVP 的实现计划。

## 4. 用户流程

```text
打开页面
  -> 粘贴 Markdown 或导入 .md
  -> 选择翻译方向
  -> 选择输出模式
  -> 点击开始转换
  -> 查看 Markdown 源码或预览
  -> 复制结果或下载 .md
```

空内容时，页面提示用户先输入或导入 Markdown。转换失败时，输出区展示错误原因，并提供重新转换入口。

## 5. 低保真界面

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Markdown 中英文转换工具                                                       │
│ 本地优先 · 保留 Markdown 结构 · 支持纯译文 / 中英对照                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ [导入 .md]  方向: [英文 -> 中文 v]  输出: [纯译文 | 中英对照]  [开始转换]       │
│                                                            [复制] [下载 .md]  │
├──────────────────────────────────────┬───────────────────────────────────────┤
│ 输入 Markdown                         │ 输出结果                              │
│ ┌──────────────────────────────────┐ │ ┌──────────────┬──────────────┐       │
│ │ # Understanding React Hooks       │ │ │ Markdown源码 │ 预览          │       │
│ │ React Hooks let you use state...  │ │ └──────────────┴──────────────┘       │
│ │ ```ts                             │ │ ┌──────────────────────────────────┐  │
│ │ const [count, setCount] = ...     │ │ │ # [ZH MOCK] Understanding...     │  │
│ │ ```                               │ │ │ ```ts                            │  │
│ └──────────────────────────────────┘ │ │ const [count, setCount] = ...    │  │
│ 字数 1,280 · 段落 12 · 可翻译块 9      │ └──────────────────────────────────┘  │
└──────────────────────────────────────┴───────────────────────────────────────┘
```

中英对照模式输出按块展示原文和译文。代码块保持原样，不参与翻译。

## 6. 技术选型

首版采用：

- Vue 3
- Vite
- TypeScript
- pnpm
- Tailwind CSS
- ant-design-vue
- Vitest

Pinia 暂不强制引入业务状态。首版只有单页面工作区，页面状态放在 `useMarkdownWorkspace.ts` 中。后续出现最近文件、全局配置、术语库、翻译记忆后，再提升到模块 Store 或应用 Store。

Vue Router 预留。首版可以只有一个工作台页面。

## 7. 项目结构

项目参考前端规范技能，采用 `app + shared + modules`：

```text
src/
  app/
    bootstrap.ts
    config/
      app.config.ts
    providers/
      ui.provider.ts
    router/
      index.ts

  shared/
    components/
      BaseEmpty.vue
      BaseError.vue
    constants/
      file.constants.ts
    styles/
      tailwind.css
    utils/
      copyText.ts
      downloadMarkdown.ts
      readMarkdownFile.ts

  modules/
    markdown-translate/
      pages/
        workspace/
          index.vue
          sections/
            ToolbarSection.vue
            SourceSection.vue
            ResultSection.vue
            StatusSection.vue
          composables/
            useMarkdownWorkspace.ts
          constants.ts
          types.ts

      model/
        markdown.types.ts
        translate.constants.ts
        translate.mapper.ts

      core/
        segmentMarkdown.ts
        buildTranslationJobs.ts
        composeOutput.ts
        collectMarkdownStats.ts

      adapters/
        translator.types.ts
        mockTranslator.ts

      routes.ts
      index.ts
```

职责边界：

- `app` 只负责应用装配、全局配置、Provider 和路由。
- `shared` 只放跨模块复用能力，例如文件读取、下载、复制、空状态组件。
- `modules/markdown-translate` 承载 Markdown 翻译业务。
- `core` 是纯 TypeScript 逻辑，不依赖 Vue 或 DOM，方便测试和后续复用。
- `adapters` 封装翻译引擎，首版只提供 Mock 实现。

## 8. 核心数据模型

```ts
export type TranslateDirection = 'en-to-zh' | 'zh-to-en';

export type OutputMode = 'translated-only' | 'bilingual';

export type WorkspaceStatus = 'idle' | 'parsing' | 'translating' | 'completed' | 'failed';

export interface SourceDocument {
  fileName?: string;
  content: string;
  updatedAt: number;
}

export interface MarkdownSegment {
  id: string;
  kind: 'heading' | 'paragraph' | 'list' | 'table-cell' | 'blockquote' | 'code' | 'html' | 'empty';
  raw: string;
  translatableText: string;
  locked: boolean;
}

export interface TranslationJob {
  segmentId: string;
  sourceText: string;
}

export interface TranslationResult {
  segmentId: string;
  sourceText: string;
  translatedText: string;
}
```

`locked` 为 `true` 的片段不进入翻译任务，例如 fenced code block、空行、HTML 块。输出合成器仍然保留这些片段的位置和原始内容。

## 9. 核心数据流

```text
SourceDocument
  -> segmentMarkdown
  -> buildTranslationJobs
  -> TranslatorAdapter.translate
  -> composeOutput
  -> ResultSection
```

页面状态流：

```text
idle
  -> parsing
  -> translating
  -> completed
```

异常时进入：

```text
failed
```

## 10. 模块职责

`workspace/index.vue`：

- 组装页面结构。
- 调用 `useMarkdownWorkspace`。
- 不直接写复杂转换逻辑。

`ToolbarSection.vue`：

- 导入文件。
- 切换翻译方向。
- 切换输出模式。
- 触发转换、复制、下载。

`SourceSection.vue`：

- 展示和编辑 Markdown 输入。
- 向外发出内容变更事件。

`ResultSection.vue`：

- 展示转换后的 Markdown 源码。
- 展示预览结果。
- 显示空状态和错误状态。

`StatusSection.vue`：

- 展示字数、段落数、可翻译块数、跳过块数、耗时。

`useMarkdownWorkspace.ts`：

- 管理工作区状态。
- 编排分段、翻译、合成输出。
- 捕获异常并转换为 UI 可展示的错误消息。

## 11. Markdown 保真规则

首版采用轻量分段策略，不做完整 Markdown AST。

规则：

- fenced code block 使用 ````` 或 `~~~` 边界识别，整体锁定。
- 行内 code 使用反引号识别，翻译时保留原样。
- 空行原样保留。
- 标题保留 `#` 前缀，只翻译标题文本。
- 列表保留 `-`、`*`、`+` 或有序编号前缀，只翻译列表文本。
- 引用保留 `>` 前缀，只翻译引用文本。
- 普通段落整体翻译。
- 普通表格优先保留管道结构，按单元格生成可翻译文本。
- HTML 块首版锁定，不翻译。

这套规则不是完整 Markdown 解析器。后续如果保真要求提高，可以替换 `segmentMarkdown` 为基于 Markdown AST 的实现。

## 12. 翻译适配器设计

```ts
export interface TranslateParams {
  direction: TranslateDirection;
  jobs: TranslationJob[];
}

export interface TranslatorAdapter {
  translate(params: TranslateParams): Promise<TranslationResult[]>;
}
```

首版实现 `mockTranslator`：

```text
en-to-zh: [ZH MOCK] source text
zh-to-en: [EN MOCK] source text
```

Mock 翻译用于验证流程和 Markdown 保真，不伪装成真实翻译质量。

后续真实引擎只新增 adapter：

- `openAiTranslator.ts`
- `deepLTranslator.ts`
- `intranetTranslator.ts`

页面和 `core` 不直接依赖具体翻译服务。

## 13. 输出模式

纯译文模式：

````text
# [ZH MOCK] Understanding React Hooks

[ZH MOCK] React Hooks let you use state.

```ts
const [count, setCount] = useState(0);
```
````

中英对照模式：

````text
# Understanding React Hooks

> 原文
> React Hooks let you use state.

> 译文
> [ZH MOCK] React Hooks let you use state.

```ts
const [count, setCount] = useState(0);
```
````

中英对照模式优先保持可读性，代码块和锁定片段原样输出。

## 14. 异常处理

必须处理：

- 输入为空：提示“请先输入或导入 Markdown 内容”。
- 文件类型不合法：提示“仅支持 .md 或 .markdown 文件”。
- 文件读取失败：提示“文件读取失败，请重新选择”。
- 未识别到可翻译文本：提示“未识别到可翻译文本，代码块和空内容会被跳过”。
- 转换过程异常：提示“转换失败，请稍后重试”。
- 复制失败：提示“浏览器限制了剪贴板访问，请手动复制”。

错误处理原则：

- `core` 层返回明确结果或抛出可识别错误。
- `useMarkdownWorkspace.ts` 负责把错误转换为 `errorMessage`。
- 组件只展示错误，不承载复杂判断。
- 不吞掉错误；开发环境可以保留调试信息，生产界面展示用户可理解的消息。

## 15. 测试策略

Vitest 单元测试覆盖：

- `segmentMarkdown` 跳过 fenced code block。
- `segmentMarkdown` 跳过行内 code。
- `segmentMarkdown` 识别标题、段落、列表、引用。
- `segmentMarkdown` 保留空行。
- `composeOutput` 生成纯译文。
- `composeOutput` 生成中英对照。
- `collectMarkdownStats` 统计可翻译块和跳过块。
- `mockTranslator` 按方向返回 `[ZH MOCK]` 或 `[EN MOCK]`。

组件测试覆盖：

- 输入为空时转换提示错误。
- 导入文件后输入区被填充。
- 切换输出模式后结果格式变化。
- 复制失败时展示可理解提示。

后续 E2E 覆盖：

- 粘贴 Markdown -> 转换 -> 复制。
- 导入 `.md` -> 转换 -> 下载 `.md`。

## 16. 后续扩展

第二阶段可扩展：

- OpenAI 翻译适配器。
- 内网翻译网关适配器。
- 术语库。
- 翻译记忆。
- 批量文件转换。
- Electron 桌面端。
- 最近文件和本地配置。

扩展顺序建议：

```text
真实翻译适配器
  -> 批量文件转换
  -> 术语库
  -> Electron 桌面端
  -> 翻译记忆
```

## 17. 待确认风险

- 轻量分段策略无法覆盖所有 Markdown 边界，复杂嵌套表格和混合 HTML 可能需要 AST 解析器。
- Mock 翻译只能验证流程，不能验证真实翻译质量、延迟和费用。
- Web MVP 的文件能力受浏览器限制，后续若要自然管理本地目录，需要 Electron。
- 中英对照格式需要在真实样本文档上继续验证，避免对长文产生过多噪音。

## 18. 工程规范约束

- Vue 页面入口 `index.vue` 控制在 300 行以内。
- 普通组件控制在 250 行以内。
- 普通 TypeScript 文件控制在 300 行以内。
- 普通函数控制在 50 行以内。
- 函数参数超过 3 个时使用对象参数。
- Props 和 Emits 必须有 TypeScript 类型。
- 不滥用 `any`；第三方适配层用 `unknown` 收敛。
- 组件不直接处理复杂 Markdown 逻辑。
- 页面不直接依赖具体翻译引擎。
