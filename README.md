# Markdown 中英文转换工具

一个本地优先的 Markdown 翻译 Web MVP。首版支持粘贴或导入单个 Markdown 文件，在保留 Markdown 基本结构的前提下，生成纯译文或中英对照的 Markdown。

## 首版能力

- 粘贴 Markdown 文本
- 导入单个 `.md` / `.markdown` 文件
- 英文 → 中文、中文 → 英文两个方向
- 纯译文 Markdown 输出
- 中英对照 Markdown 输出（按块呈现原文与译文）
- 输出源码 / 预览切换
- 复制结果、下载 `.md`
- Mock 翻译引擎（不调用真实翻译服务，验证流程与保真）
- 自动跳过 fenced code block、HTML 块、空行；保留标题、段落、列表、引用等结构

## 技术栈

- Vue 3（`<script setup>` + Composition API）
- Vite
- TypeScript（strict 模式）
- pnpm
- Tailwind CSS v4
- ant-design-vue
- Vitest + Vue Test Utils

## 架构

采用 `app + shared + modules` 三层结构：

```text
src/
  app/          # 应用装配：bootstrap、config、provider、router
  shared/       # 跨模块复用：文件工具、复制、下载、空/错误状态组件
  modules/
    markdown-translate/
      model/      # 领域类型与常量
      core/       # 纯 TS 逻辑：分段、构建任务、合成输出、统计（可独立测试）
      adapters/   # 翻译适配器：TranslatorAdapter 接口 + mockTranslator
      pages/
        workspace/  # 工作区页面、composable、sections
```

设计要点：

- `core` 是纯 TypeScript，不依赖 Vue/DOM，可独立单元测试，后续可整体替换。
- `adapters` 隔离翻译引擎，页面与 core 只依赖 `TranslatorAdapter` 接口；新增 OpenAI、DeepL、内网网关等真实引擎只需实现接口。
- 组件只编排交互，业务状态集中在 `useMarkdownWorkspace` composable。

核心数据流：

```text
SourceDocument
  -> segmentMarkdown      # 分段，锁定代码块/HTML/空行
  -> buildTranslationJobs # 过滤出可翻译任务
  -> TranslatorAdapter    # 翻译（首版 mockTranslator）
  -> composeOutput        # 合成纯译文 / 中英对照
```

## 开发

```bash
pnpm install
pnpm dev
```

## 质量检查

```bash
pnpm typecheck   # vue-tsc 类型检查
pnpm test:run    # vitest 单测
pnpm build       # 类型检查 + 单测 + 生产构建
pnpm lint        # eslint
```

## 非目标（首版不做）

真实翻译 API、批量目录翻译、术语库、翻译记忆、登录与云同步、Electron 打包、Markdown 所见即所得编辑。这些能力按需在后续阶段引入，详见 `docs/superpowers/specs/2026-07-05-markdown-translate-design.md`。

## 已知限制

- 分段采用轻量按行扫描，复杂嵌套表格与混合 HTML 仍需基于完整 Markdown AST 的实现才能更好保真。
- 预览页采用纯文本排版，未渲染 Markdown 富文本；如需富文本预览，后续接入 `markdown-it`。
- Mock 翻译仅用于验证流程，不代表真实翻译质量、延迟与费用。
