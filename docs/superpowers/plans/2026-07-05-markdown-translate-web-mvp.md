# Markdown Translate Web MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vue 3 Web MVP that converts single Markdown documents into translated-only or bilingual Markdown while preserving basic Markdown structure.

**Architecture:** Use the confirmed `app + shared + modules` structure. Keep Markdown parsing, translation job building, output composition, and statistics in pure TypeScript under `modules/markdown-translate/core`; Vue components only orchestrate UI and call composables.

**Tech Stack:** Vue 3, Vite, TypeScript, pnpm, Tailwind CSS, ant-design-vue, Vitest, Vue Test Utils.

---

## File Structure

Create or modify these files:

```text
package.json
pnpm-lock.yaml
index.html
vite.config.ts
tsconfig.json
tsconfig.node.json
vitest.config.ts
tailwind.config.ts
postcss.config.js
.editorconfig
.npmrc
.prettierrc
eslint.config.js
src/main.ts
src/App.vue
src/app/bootstrap.ts
src/app/config/app.config.ts
src/app/providers/ui.provider.ts
src/app/router/index.ts
src/shared/components/BaseEmpty.vue
src/shared/components/BaseError.vue
src/shared/constants/file.constants.ts
src/shared/styles/tailwind.css
src/shared/utils/copyText.ts
src/shared/utils/downloadMarkdown.ts
src/shared/utils/readMarkdownFile.ts
src/modules/markdown-translate/index.ts
src/modules/markdown-translate/routes.ts
src/modules/markdown-translate/model/markdown.types.ts
src/modules/markdown-translate/model/translate.constants.ts
src/modules/markdown-translate/model/translate.mapper.ts
src/modules/markdown-translate/core/segmentMarkdown.ts
src/modules/markdown-translate/core/buildTranslationJobs.ts
src/modules/markdown-translate/core/composeOutput.ts
src/modules/markdown-translate/core/collectMarkdownStats.ts
src/modules/markdown-translate/adapters/translator.types.ts
src/modules/markdown-translate/adapters/mockTranslator.ts
src/modules/markdown-translate/pages/workspace/index.vue
src/modules/markdown-translate/pages/workspace/constants.ts
src/modules/markdown-translate/pages/workspace/types.ts
src/modules/markdown-translate/pages/workspace/composables/useMarkdownWorkspace.ts
src/modules/markdown-translate/pages/workspace/sections/ToolbarSection.vue
src/modules/markdown-translate/pages/workspace/sections/SourceSection.vue
src/modules/markdown-translate/pages/workspace/sections/ResultSection.vue
src/modules/markdown-translate/pages/workspace/sections/StatusSection.vue
src/modules/markdown-translate/core/__tests__/segmentMarkdown.test.ts
src/modules/markdown-translate/core/__tests__/composeOutput.test.ts
src/modules/markdown-translate/core/__tests__/collectMarkdownStats.test.ts
src/modules/markdown-translate/adapters/__tests__/mockTranslator.test.ts
README.md
```

## Task 1: Initialize Vue 3 Project Shell

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/app/bootstrap.ts`
- Create: `.editorconfig`
- Create: `.npmrc`
- Create: `.prettierrc`

- [ ] **Step 1: Initialize git for task commits**

Run:

```bash
git init
git add docs/superpowers/specs/2026-07-05-markdown-translate-design.md docs/superpowers/plans/2026-07-05-markdown-translate-web-mvp.md
git commit -m "docs: define markdown translate mvp"
```

Expected: git repository is initialized and the approved spec plus this plan are committed.

- [ ] **Step 2: Create package manifest**

Create `package.json`:

```json
{
  "name": "markdown-en-to-cn",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "vite",
    "build": "pnpm typecheck && pnpm test:run && vite build",
    "preview": "vite preview",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint \"src/**/*.{ts,vue}\"",
    "format": "prettier --write \"src/**/*.{ts,vue,css,md}\""
  }
}
```

- [ ] **Step 3: Create minimal app entry files**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Markdown 中英文转换工具</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Create `src/main.ts`:

```ts
import { bootstrap } from './app/bootstrap';

bootstrap();
```

Create `src/App.vue`:

```vue
<template>
  <main>Markdown 中英文转换工具</main>
</template>
```

Create `src/app/bootstrap.ts`:

```ts
import { createApp } from 'vue';

import App from '../App.vue';

export function bootstrap(): void {
  createApp(App).mount('#app');
}
```

- [ ] **Step 4: Add editor and package-manager config**

Create `.editorconfig`:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

Create `.npmrc`:

```ini
shamefully-hoist=false
strict-peer-dependencies=false
auto-install-peers=true
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "all",
  "arrowParens": "always"
}
```

- [ ] **Step 5: Install dependencies**

Run:

```bash
pnpm add vue vue-router pinia ant-design-vue
pnpm add -D @vitejs/plugin-vue @vue/test-utils @types/node autoprefixer eslint eslint-plugin-vue jsdom postcss prettier tailwindcss typescript vite vitest vue-tsc
pnpm install
```

Expected: `package.json` receives runtime and development dependencies, and `pnpm-lock.yaml` is created.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml index.html src/main.ts src/App.vue src/app/bootstrap.ts .editorconfig .npmrc .prettierrc
git commit -m "chore: initialize vue markdown translate app"
```

## Task 2: Add Build, TypeScript, Tailwind, Router, and App Bootstrap

**Files:**
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vitest.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `eslint.config.js`
- Modify: `src/App.vue`
- Modify: `src/app/bootstrap.ts`
- Create: `src/app/config/app.config.ts`
- Create: `src/app/providers/ui.provider.ts`
- Create: `src/app/router/index.ts`
- Create: `src/shared/styles/tailwind.css`

- [ ] **Step 1: Add Vite and TypeScript config**

Create `vite.config.ts`:

```ts
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vitest/globals"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

- [ ] **Step 2: Add Vitest, Tailwind, and ESLint config**

Create `vitest.config.ts`:

```ts
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

Create `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Create `eslint.config.js`:

```js
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.{ts,vue}'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },
];
```

- [ ] **Step 3: Add app bootstrap and UI provider**

Create `src/app/config/app.config.ts`:

```ts
import type { OutputMode, TranslateDirection } from '@/modules/markdown-translate/model/markdown.types';

export interface AppConfig {
  title: string;
  defaultDirection: TranslateDirection;
  defaultOutputMode: OutputMode;
}

export const appConfig: AppConfig = {
  title: 'Markdown 中英文转换工具',
  defaultDirection: 'en-to-zh',
  defaultOutputMode: 'translated-only',
};
```

Create `src/app/providers/ui.provider.ts`:

```ts
import {
  Button,
  ConfigProvider,
  Empty,
  Input,
  Radio,
  Select,
  Space,
  Tabs,
  Typography,
  Upload,
} from 'ant-design-vue';
import type { App } from 'vue';

import 'ant-design-vue/dist/reset.css';
import '@/shared/styles/tailwind.css';

export function registerUiProvider(app: App): void {
  app
    .use(ConfigProvider)
    .use(Button)
    .use(Empty)
    .use(Input)
    .use(Radio)
    .use(Select)
    .use(Space)
    .use(Tabs)
    .use(Typography)
    .use(Upload);
}
```

Create `src/app/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router';

import { markdownTranslateRoutes } from '@/modules/markdown-translate/routes';

export const router = createRouter({
  history: createWebHistory(),
  routes: [...markdownTranslateRoutes],
});
```

Modify `src/app/bootstrap.ts`:

```ts
import { createApp } from 'vue';

import App from '@/App.vue';
import { registerUiProvider } from '@/app/providers/ui.provider';
import { router } from '@/app/router';

export function bootstrap(): void {
  const app = createApp(App);

  registerUiProvider(app);
  app.use(router);
  app.mount('#app');
}
```

Modify `src/App.vue`:

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>
```

Create `src/shared/styles/tailwind.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  background: #f5f7fb;
  color: #1f2937;
}
```

- [ ] **Step 4: Run checks**

Run:

```bash
pnpm typecheck
pnpm lint
```

Expected: both commands pass.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts tsconfig.json tsconfig.node.json vitest.config.ts tailwind.config.ts postcss.config.js eslint.config.js src/App.vue src/app src/shared/styles
git commit -m "chore: configure vue app shell"
```

## Task 3: Define Markdown Translate Models and Constants

**Files:**
- Create: `src/modules/markdown-translate/model/markdown.types.ts`
- Create: `src/modules/markdown-translate/model/translate.constants.ts`
- Create: `src/modules/markdown-translate/model/translate.mapper.ts`
- Create: `src/modules/markdown-translate/index.ts`
- Create: `src/modules/markdown-translate/routes.ts`

- [ ] **Step 1: Add core types**

Create `src/modules/markdown-translate/model/markdown.types.ts`:

```ts
export type TranslateDirection = 'en-to-zh' | 'zh-to-en';

export type OutputMode = 'translated-only' | 'bilingual';

export type WorkspaceStatus = 'idle' | 'parsing' | 'translating' | 'completed' | 'failed';

export type MarkdownSegmentKind =
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'table-cell'
  | 'blockquote'
  | 'code'
  | 'html'
  | 'empty';

export interface SourceDocument {
  fileName?: string;
  content: string;
  updatedAt: number;
}

export interface MarkdownSegment {
  id: string;
  kind: MarkdownSegmentKind;
  raw: string;
  translatableText: string;
  locked: boolean;
  prefix?: string;
  suffix?: string;
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

export interface MarkdownStats {
  characters: number;
  lines: number;
  translatableBlocks: number;
  skippedBlocks: number;
}
```

- [ ] **Step 2: Add constants and route**

Create `src/modules/markdown-translate/model/translate.constants.ts`:

```ts
import type { OutputMode, TranslateDirection } from './markdown.types';

export const TRANSLATE_DIRECTION_OPTIONS: Array<{ label: string; value: TranslateDirection }> = [
  { label: '英文 -> 中文', value: 'en-to-zh' },
  { label: '中文 -> 英文', value: 'zh-to-en' },
];

export const OUTPUT_MODE_OPTIONS: Array<{ label: string; value: OutputMode }> = [
  { label: '纯译文', value: 'translated-only' },
  { label: '中英对照', value: 'bilingual' },
];
```

Create `src/modules/markdown-translate/model/translate.mapper.ts`:

```ts
import type { TranslationResult } from './markdown.types';

export function mapResultsBySegmentId(results: TranslationResult[]): Map<string, TranslationResult> {
  return new Map(results.map((result) => [result.segmentId, result]));
}
```

Create `src/modules/markdown-translate/routes.ts`:

```ts
import type { RouteRecordRaw } from 'vue-router';

export const markdownTranslateRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'MarkdownTranslateWorkspace',
    component: () => import('./pages/workspace/index.vue'),
  },
];
```

Create `src/modules/markdown-translate/index.ts`:

```ts
export { markdownTranslateRoutes } from './routes';
```

- [ ] **Step 3: Add temporary workspace page**

Create `src/modules/markdown-translate/pages/workspace/index.vue`:

```vue
<template>
  <main class="min-h-screen p-6">
    <h1 class="text-xl font-semibold">Markdown 中英文转换工具</h1>
  </main>
</template>
```

- [ ] **Step 4: Run checks**

```bash
pnpm typecheck
pnpm build
```

Expected: typecheck and production build pass.

- [ ] **Step 5: Commit**

```bash
git add src/modules/markdown-translate
git commit -m "feat: add markdown translate module model"
```

## Task 4: Build Core Markdown Parsing with Failing Tests First

**Files:**
- Create: `src/modules/markdown-translate/core/__tests__/segmentMarkdown.test.ts`
- Create: `src/modules/markdown-translate/core/segmentMarkdown.ts`
- Create: `src/modules/markdown-translate/core/buildTranslationJobs.ts`

- [ ] **Step 1: Write failing tests**

Create `src/modules/markdown-translate/core/__tests__/segmentMarkdown.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { buildTranslationJobs } from '../buildTranslationJobs';
import { segmentMarkdown } from '../segmentMarkdown';

describe('segmentMarkdown', () => {
  it('locks fenced code blocks and keeps them out of translation jobs', () => {
    const segments = segmentMarkdown('# Title\n\n```ts\nconst count = 1;\n```\n\nHello world.');

    expect(segments.some((segment) => segment.kind === 'code' && segment.locked)).toBe(true);
    expect(buildTranslationJobs(segments)).toEqual([
      { segmentId: 'seg-1', sourceText: 'Title' },
      { segmentId: 'seg-5', sourceText: 'Hello world.' },
    ]);
  });

  it('detects headings, blockquotes, lists, paragraphs, and empty lines', () => {
    const segments = segmentMarkdown('# Title\n\n> Quote\n\n- Item\n\nPlain paragraph');

    expect(segments.map((segment) => segment.kind)).toEqual([
      'heading',
      'empty',
      'blockquote',
      'empty',
      'list',
      'empty',
      'paragraph',
    ]);
  });

  it('keeps inline code inside translatable text markers', () => {
    const segments = segmentMarkdown('Use `const value = 1` in examples.');

    expect(segments[0]).toMatchObject({
      kind: 'paragraph',
      translatableText: 'Use `const value = 1` in examples.',
      locked: false,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test:run src/modules/markdown-translate/core/__tests__/segmentMarkdown.test.ts
```

Expected: FAIL because `segmentMarkdown` and `buildTranslationJobs` do not exist.

- [ ] **Step 3: Implement minimal parser and job builder**

Create `src/modules/markdown-translate/core/segmentMarkdown.ts`:

```ts
import type { MarkdownSegment, MarkdownSegmentKind } from '../model/markdown.types';

function createSegment(params: {
  index: number;
  kind: MarkdownSegmentKind;
  raw: string;
  translatableText?: string;
  locked?: boolean;
  prefix?: string;
  suffix?: string;
}): MarkdownSegment {
  return {
    id: `seg-${params.index}`,
    kind: params.kind,
    raw: params.raw,
    translatableText: params.translatableText ?? '',
    locked: params.locked ?? false,
    prefix: params.prefix,
    suffix: params.suffix,
  };
}

function parseLine(index: number, raw: string): MarkdownSegment {
  if (raw.trim() === '') {
    return createSegment({ index, kind: 'empty', raw, locked: true });
  }

  const heading = raw.match(/^(#{1,6}\s+)(.+)$/);
  if (heading?.[1] && heading[2]) {
    return createSegment({ index, kind: 'heading', raw, prefix: heading[1], translatableText: heading[2] });
  }

  const blockquote = raw.match(/^(>\s?)(.+)$/);
  if (blockquote?.[1] && blockquote[2]) {
    return createSegment({
      index,
      kind: 'blockquote',
      raw,
      prefix: blockquote[1],
      translatableText: blockquote[2],
    });
  }

  const list = raw.match(/^(\s*(?:[-*+]|\d+\.)\s+)(.+)$/);
  if (list?.[1] && list[2]) {
    return createSegment({ index, kind: 'list', raw, prefix: list[1], translatableText: list[2] });
  }

  if (/^\s*</.test(raw)) {
    return createSegment({ index, kind: 'html', raw, locked: true });
  }

  return createSegment({ index, kind: 'paragraph', raw, translatableText: raw });
}

export function segmentMarkdown(content: string): MarkdownSegment[] {
  const lines = content.split(/\r?\n/);
  const segments: MarkdownSegment[] = [];
  let isInFence = false;
  let fenceBuffer: string[] = [];
  let fenceStartIndex = 0;

  lines.forEach((line, lineIndex) => {
    const segmentIndex = lineIndex + 1;
    const isFence = /^\s*(```|~~~)/.test(line);

    if (isFence && !isInFence) {
      isInFence = true;
      fenceStartIndex = segmentIndex;
      fenceBuffer = [line];
      return;
    }

    if (isInFence) {
      fenceBuffer.push(line);
      if (isFence && fenceBuffer.length > 1) {
        segments.push(
          createSegment({
            index: fenceStartIndex,
            kind: 'code',
            raw: fenceBuffer.join('\n'),
            locked: true,
          }),
        );
        isInFence = false;
        fenceBuffer = [];
      }
      return;
    }

    segments.push(parseLine(segmentIndex, line));
  });

  if (isInFence) {
    segments.push(
      createSegment({
        index: fenceStartIndex,
        kind: 'code',
        raw: fenceBuffer.join('\n'),
        locked: true,
      }),
    );
  }

  return segments;
}
```

Create `src/modules/markdown-translate/core/buildTranslationJobs.ts`:

```ts
import type { MarkdownSegment, TranslationJob } from '../model/markdown.types';

export function buildTranslationJobs(segments: MarkdownSegment[]): TranslationJob[] {
  return segments
    .filter((segment) => !segment.locked && segment.translatableText.trim().length > 0)
    .map((segment) => ({
      segmentId: segment.id,
      sourceText: segment.translatableText,
    }));
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test:run src/modules/markdown-translate/core/__tests__/segmentMarkdown.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/modules/markdown-translate/core
git commit -m "feat: segment markdown into translation jobs"
```

## Task 5: Build Output Composition and Statistics

**Files:**
- Create: `src/modules/markdown-translate/core/__tests__/composeOutput.test.ts`
- Create: `src/modules/markdown-translate/core/__tests__/collectMarkdownStats.test.ts`
- Create: `src/modules/markdown-translate/core/composeOutput.ts`
- Create: `src/modules/markdown-translate/core/collectMarkdownStats.ts`

- [ ] **Step 1: Write failing tests**

Create `src/modules/markdown-translate/core/__tests__/composeOutput.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import type { MarkdownSegment, TranslationResult } from '../../model/markdown.types';
import { composeOutput } from '../composeOutput';

const segments: MarkdownSegment[] = [
  { id: 'seg-1', kind: 'heading', raw: '# Title', prefix: '# ', translatableText: 'Title', locked: false },
  { id: 'seg-2', kind: 'empty', raw: '', translatableText: '', locked: true },
  { id: 'seg-3', kind: 'code', raw: '```ts\nconst count = 1;\n```', translatableText: '', locked: true },
];

const results: TranslationResult[] = [{ segmentId: 'seg-1', sourceText: 'Title', translatedText: '[ZH MOCK] Title' }];

describe('composeOutput', () => {
  it('creates translated-only markdown', () => {
    expect(composeOutput({ segments, results, outputMode: 'translated-only' })).toBe(
      '# [ZH MOCK] Title\n\n```ts\nconst count = 1;\n```',
    );
  });

  it('creates bilingual markdown', () => {
    expect(composeOutput({ segments, results, outputMode: 'bilingual' })).toBe(
      '# Title\n\n> 原文\n> Title\n\n> 译文\n> [ZH MOCK] Title\n\n```ts\nconst count = 1;\n```',
    );
  });
});
```

Create `src/modules/markdown-translate/core/__tests__/collectMarkdownStats.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { collectMarkdownStats } from '../collectMarkdownStats';
import { segmentMarkdown } from '../segmentMarkdown';

describe('collectMarkdownStats', () => {
  it('counts characters, lines, translatable blocks, and skipped blocks', () => {
    const segments = segmentMarkdown('# Title\n\n```ts\nconst value = 1;\n```\n\nText');

    expect(collectMarkdownStats('# Title\n\n```ts\nconst value = 1;\n```\n\nText', segments)).toEqual({
      characters: 41,
      lines: 7,
      translatableBlocks: 2,
      skippedBlocks: 2,
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run src/modules/markdown-translate/core/__tests__/composeOutput.test.ts src/modules/markdown-translate/core/__tests__/collectMarkdownStats.test.ts
```

Expected: FAIL because `composeOutput` and `collectMarkdownStats` do not exist.

- [ ] **Step 3: Implement output composition and stats**

Create `src/modules/markdown-translate/core/composeOutput.ts`:

```ts
import { mapResultsBySegmentId } from '../model/translate.mapper';
import type { MarkdownSegment, OutputMode, TranslationResult } from '../model/markdown.types';

interface ComposeOutputParams {
  segments: MarkdownSegment[];
  results: TranslationResult[];
  outputMode: OutputMode;
}

function composeTranslatedLine(segment: MarkdownSegment, translatedText: string): string {
  return `${segment.prefix ?? ''}${translatedText}${segment.suffix ?? ''}`;
}

function composeBilingualBlock(segment: MarkdownSegment, translatedText: string): string {
  if (segment.kind === 'heading') {
    return `${segment.raw}\n\n> 原文\n> ${segment.translatableText}\n\n> 译文\n> ${translatedText}`;
  }

  return `> 原文\n> ${segment.translatableText}\n\n> 译文\n> ${translatedText}`;
}

export function composeOutput(params: ComposeOutputParams): string {
  const resultMap = mapResultsBySegmentId(params.results);

  return params.segments
    .map((segment) => {
      if (segment.locked) {
        return segment.raw;
      }

      const result = resultMap.get(segment.id);
      const translatedText = result?.translatedText ?? segment.translatableText;

      if (params.outputMode === 'bilingual') {
        return composeBilingualBlock(segment, translatedText);
      }

      return composeTranslatedLine(segment, translatedText);
    })
    .join('\n');
}
```

Create `src/modules/markdown-translate/core/collectMarkdownStats.ts`:

```ts
import type { MarkdownSegment, MarkdownStats } from '../model/markdown.types';

export function collectMarkdownStats(content: string, segments: MarkdownSegment[]): MarkdownStats {
  return {
    characters: content.length,
    lines: content.length === 0 ? 0 : content.split(/\r?\n/).length,
    translatableBlocks: segments.filter((segment) => !segment.locked && segment.translatableText.trim()).length,
    skippedBlocks: segments.filter((segment) => segment.locked && segment.kind !== 'empty').length,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test:run src/modules/markdown-translate/core/__tests__
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/modules/markdown-translate/core src/modules/markdown-translate/model/translate.mapper.ts
git commit -m "feat: compose markdown translation output"
```

## Task 6: Add Mock Translator Adapter

**Files:**
- Create: `src/modules/markdown-translate/adapters/__tests__/mockTranslator.test.ts`
- Create: `src/modules/markdown-translate/adapters/translator.types.ts`
- Create: `src/modules/markdown-translate/adapters/mockTranslator.ts`

- [ ] **Step 1: Write failing adapter test**

Create `src/modules/markdown-translate/adapters/__tests__/mockTranslator.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { mockTranslator } from '../mockTranslator';

describe('mockTranslator', () => {
  it('prefixes English to Chinese results with ZH MOCK', async () => {
    await expect(
      mockTranslator.translate({
        direction: 'en-to-zh',
        jobs: [{ segmentId: 'seg-1', sourceText: 'Hello world' }],
      }),
    ).resolves.toEqual([
      { segmentId: 'seg-1', sourceText: 'Hello world', translatedText: '[ZH MOCK] Hello world' },
    ]);
  });

  it('prefixes Chinese to English results with EN MOCK', async () => {
    await expect(
      mockTranslator.translate({
        direction: 'zh-to-en',
        jobs: [{ segmentId: 'seg-1', sourceText: '你好' }],
      }),
    ).resolves.toEqual([{ segmentId: 'seg-1', sourceText: '你好', translatedText: '[EN MOCK] 你好' }]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test:run src/modules/markdown-translate/adapters/__tests__/mockTranslator.test.ts
```

Expected: FAIL because adapter files do not exist.

- [ ] **Step 3: Implement adapter interface and mock translator**

Create `src/modules/markdown-translate/adapters/translator.types.ts`:

```ts
import type { TranslateDirection, TranslationJob, TranslationResult } from '../model/markdown.types';

export interface TranslateParams {
  direction: TranslateDirection;
  jobs: TranslationJob[];
}

export interface TranslatorAdapter {
  translate(params: TranslateParams): Promise<TranslationResult[]>;
}
```

Create `src/modules/markdown-translate/adapters/mockTranslator.ts`:

```ts
import type { TranslatorAdapter } from './translator.types';

export const mockTranslator: TranslatorAdapter = {
  async translate(params) {
    const prefix = params.direction === 'en-to-zh' ? '[ZH MOCK]' : '[EN MOCK]';

    return params.jobs.map((job) => ({
      segmentId: job.segmentId,
      sourceText: job.sourceText,
      translatedText: `${prefix} ${job.sourceText}`,
    }));
  },
};
```

- [ ] **Step 4: Run adapter tests**

```bash
pnpm test:run src/modules/markdown-translate/adapters/__tests__/mockTranslator.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/modules/markdown-translate/adapters
git commit -m "feat: add mock translator adapter"
```

## Task 7: Add Shared File Utilities and Base States

**Files:**
- Create: `src/shared/constants/file.constants.ts`
- Create: `src/shared/utils/copyText.ts`
- Create: `src/shared/utils/downloadMarkdown.ts`
- Create: `src/shared/utils/readMarkdownFile.ts`
- Create: `src/shared/components/BaseEmpty.vue`
- Create: `src/shared/components/BaseError.vue`

- [ ] **Step 1: Implement constants and utilities**

Create `src/shared/constants/file.constants.ts`:

```ts
export const MARKDOWN_FILE_EXTENSIONS = ['.md', '.markdown'] as const;
export const MARKDOWN_MIME_TYPES = ['text/markdown', 'text/plain'] as const;
export const DEFAULT_DOWNLOAD_FILE_NAME = 'translated-markdown.md';
```

Create `src/shared/utils/copyText.ts`:

```ts
export async function copyText(text: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API is unavailable');
  }

  await navigator.clipboard.writeText(text);
}
```

Create `src/shared/utils/downloadMarkdown.ts`:

```ts
import { DEFAULT_DOWNLOAD_FILE_NAME } from '@/shared/constants/file.constants';

export function downloadMarkdown(content: string, fileName = DEFAULT_DOWNLOAD_FILE_NAME): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
```

Create `src/shared/utils/readMarkdownFile.ts`:

```ts
import { MARKDOWN_FILE_EXTENSIONS } from '@/shared/constants/file.constants';

function isMarkdownFile(file: File): boolean {
  const normalizedName = file.name.toLowerCase();
  return MARKDOWN_FILE_EXTENSIONS.some((extension) => normalizedName.endsWith(extension));
}

export async function readMarkdownFile(file: File): Promise<string> {
  if (!isMarkdownFile(file)) {
    throw new Error('Unsupported markdown file type');
  }

  return file.text();
}
```

- [ ] **Step 2: Add base state components**

Create `src/shared/components/BaseEmpty.vue`:

```vue
<script setup lang="ts">
interface Props {
  description: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex h-full min-h-48 items-center justify-center rounded border border-dashed border-slate-300 bg-white">
    <a-empty :description="description" />
  </div>
</template>
```

Create `src/shared/components/BaseError.vue`:

```vue
<script setup lang="ts">
interface Props {
  message: string;
}

defineProps<Props>();
</script>

<template>
  <div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {{ message }}
  </div>
</template>
```

- [ ] **Step 3: Run checks**

```bash
pnpm typecheck
pnpm lint
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/shared
git commit -m "feat: add shared markdown file utilities"
```

## Task 8: Build Workspace Composable

**Files:**
- Create: `src/modules/markdown-translate/pages/workspace/composables/useMarkdownWorkspace.ts`
- Create: `src/modules/markdown-translate/pages/workspace/constants.ts`
- Create: `src/modules/markdown-translate/pages/workspace/types.ts`

- [ ] **Step 1: Add workspace constants and types**

Create `src/modules/markdown-translate/pages/workspace/constants.ts`:

```ts
export const EXAMPLE_MARKDOWN = `# Understanding React Hooks

React Hooks let you use state and lifecycle features in function components.

\`\`\`ts
const [count, setCount] = useState(0);
\`\`\`

- reusable logic
- component state
`;
```

Create `src/modules/markdown-translate/pages/workspace/types.ts`:

```ts
import type { MarkdownStats, OutputMode, TranslateDirection, WorkspaceStatus } from '../../model/markdown.types';

export interface WorkspaceState {
  source: string;
  result: string;
  direction: TranslateDirection;
  outputMode: OutputMode;
  status: WorkspaceStatus;
  errorMessage: string;
  stats: MarkdownStats;
  elapsedMs: number;
}
```

- [ ] **Step 2: Implement workspace orchestration**

Create `src/modules/markdown-translate/pages/workspace/composables/useMarkdownWorkspace.ts`:

```ts
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

  const canConvert = computed(() => state.source.trim().length > 0 && state.status !== 'parsing' && state.status !== 'translating');

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

  async function copyResult(): Promise<void> {
    try {
      await copyText(state.result);
    } catch (error) {
      console.error('[copyResult]', error);
      state.errorMessage = '浏览器限制了剪贴板访问，请手动复制';
    }
  }

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
```

- [ ] **Step 3: Run checks**

```bash
pnpm typecheck
pnpm lint
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/modules/markdown-translate/pages/workspace
git commit -m "feat: orchestrate markdown workspace state"
```

## Task 9: Build Workspace UI Sections

**Files:**
- Modify: `src/modules/markdown-translate/pages/workspace/index.vue`
- Create: `src/modules/markdown-translate/pages/workspace/sections/ToolbarSection.vue`
- Create: `src/modules/markdown-translate/pages/workspace/sections/SourceSection.vue`
- Create: `src/modules/markdown-translate/pages/workspace/sections/ResultSection.vue`
- Create: `src/modules/markdown-translate/pages/workspace/sections/StatusSection.vue`

- [ ] **Step 1: Add toolbar section**

Create `ToolbarSection.vue` with typed props and emits:

```vue
<script setup lang="ts">
import { computed } from 'vue';

import { OUTPUT_MODE_OPTIONS, TRANSLATE_DIRECTION_OPTIONS } from '../../../model/translate.constants';
import type { OutputMode, TranslateDirection, WorkspaceStatus } from '../../../model/markdown.types';

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

const isBusy = computed(() => props.status === 'parsing' || props.status === 'translating');

function updateDirection(value: unknown): void {
  emit('update:direction', value as TranslateDirection);
}

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
  input.value = '';
}
</script>

<template>
  <section class="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
    <label class="inline-flex cursor-pointer items-center rounded border border-slate-300 px-3 py-1.5 text-sm">
      导入 .md
      <input class="hidden" type="file" accept=".md,.markdown" @change="handleFileChange" />
    </label>
    <a-select
      :value="direction"
      class="w-36"
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
```

- [ ] **Step 2: Add source, result, and status sections**

Create `SourceSection.vue`:

```vue
<script setup lang="ts">
interface Props {
  modelValue: string;
}

defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function updateValue(event: Event): void {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col bg-white">
    <header class="border-b border-slate-200 px-4 py-2 text-sm font-medium">输入 Markdown</header>
    <a-textarea
      :value="modelValue"
      class="min-h-0 flex-1 resize-none border-0 font-mono text-sm"
      placeholder="粘贴 Markdown 内容，或点击导入 .md"
      @input="updateValue"
    />
  </section>
</template>
```

Create `ResultSection.vue`:

```vue
<script setup lang="ts">
import BaseEmpty from '@/shared/components/BaseEmpty.vue';
import BaseError from '@/shared/components/BaseError.vue';

interface Props {
  result: string;
  errorMessage: string;
}

defineProps<Props>();
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col bg-white">
    <header class="border-b border-slate-200 px-4 py-2 text-sm font-medium">输出结果</header>
    <BaseError v-if="errorMessage" class="m-4" :message="errorMessage" />
    <BaseEmpty v-else-if="!result" description="等待转换" />
    <a-tabs v-else class="min-h-0 flex-1 px-4" size="small">
      <a-tab-pane key="source" tab="Markdown源码">
        <pre class="min-h-96 overflow-auto whitespace-pre-wrap rounded bg-slate-950 p-4 text-sm text-slate-50">{{ result }}</pre>
      </a-tab-pane>
      <a-tab-pane key="preview" tab="预览">
        <article class="prose max-w-none whitespace-pre-wrap rounded border border-slate-200 p-4">{{ result }}</article>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>
```

Create `StatusSection.vue`:

```vue
<script setup lang="ts">
import type { MarkdownStats, WorkspaceStatus } from '../../../model/markdown.types';

interface Props {
  status: WorkspaceStatus;
  stats: MarkdownStats;
  elapsedMs: number;
}

defineProps<Props>();
</script>

<template>
  <footer class="flex flex-wrap gap-4 border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
    <span>状态：{{ status }}</span>
    <span>字数：{{ stats.characters }}</span>
    <span>行数：{{ stats.lines }}</span>
    <span>可翻译块：{{ stats.translatableBlocks }}</span>
    <span>跳过块：{{ stats.skippedBlocks }}</span>
    <span>耗时：{{ elapsedMs }}ms</span>
  </footer>
</template>
```

- [ ] **Step 3: Compose workspace page**

Replace `src/modules/markdown-translate/pages/workspace/index.vue`:

```vue
<script setup lang="ts">
import ResultSection from './sections/ResultSection.vue';
import SourceSection from './sections/SourceSection.vue';
import StatusSection from './sections/StatusSection.vue';
import ToolbarSection from './sections/ToolbarSection.vue';
import { useMarkdownWorkspace } from './composables/useMarkdownWorkspace';

const { state, canConvert, convertMarkdown, importFile, copyResult, downloadResult } = useMarkdownWorkspace();
</script>

<template>
  <main class="flex h-screen min-h-0 flex-col bg-slate-100">
    <header class="bg-white px-5 py-4">
      <h1 class="text-xl font-semibold">Markdown 中英文转换工具</h1>
      <p class="mt-1 text-sm text-slate-500">本地优先 · 保留 Markdown 结构 · 支持纯译文 / 中英对照</p>
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
```

- [ ] **Step 4: Run checks and inspect locally**

```bash
pnpm typecheck
pnpm build
pnpm dev
```

Expected:

- typecheck passes.
- build passes.
- local dev server opens the workspace page.
- Clicking “开始转换” generates Mock output.

- [ ] **Step 5: Commit**

```bash
git add src/modules/markdown-translate/pages/workspace src/shared/components
git commit -m "feat: build markdown translate workspace"
```

## Task 10: Add README and Final Verification

**Files:**
- Create or modify: `README.md`

- [ ] **Step 1: Write README**

Create `README.md`:

```md
# Markdown 中英文转换工具

一个本地优先的 Markdown 翻译 Web MVP。首版支持粘贴或导入单个 Markdown 文件，生成纯译文或中英对照 Markdown。

## 技术栈

- Vue 3
- Vite
- TypeScript
- pnpm
- Tailwind CSS
- ant-design-vue
- Vitest

## 开发

```bash
pnpm install
pnpm dev
```

## 质量检查

```bash
pnpm typecheck
pnpm test:run
pnpm build
```

## 首版范围

- 粘贴 Markdown
- 导入 `.md` / `.markdown`
- 英文到中文、中文到英文
- 纯译文输出
- 中英对照输出
- 复制和下载结果
- Mock 翻译引擎

## 非目标

首版不包含真实翻译 API、批量翻译、术语库、翻译记忆、Electron 打包和云同步。
```

- [ ] **Step 2: Run full verification**

```bash
pnpm typecheck
pnpm test:run
pnpm build
```

Expected: all commands pass.

- [ ] **Step 3: Start local server for user trial**

```bash
pnpm dev
```

Expected: Vite prints a local URL, usually `http://localhost:5173/`.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add markdown translate readme"
```

## Self-Review

Spec coverage:

- Single-file paste/import is covered by Tasks 7-9.
- Translated-only and bilingual output are covered by Task 5.
- Mock adapter is covered by Task 6.
- `app + shared + modules` architecture is covered by Tasks 2-3.
- Markdown preservation rules are covered by Tasks 4-5.
- Error handling is covered by Tasks 7-9.
- Unit tests are covered by Tasks 4-6.

Risk notes:

- The first parser is line-based and intentionally limited. Complex nested Markdown remains a known future upgrade path.
- The preview in Task 9 uses plain text rendering for MVP. If rendered Markdown is required in the first implementation pass, add `markdown-it` as a follow-up task after confirming dependency choice.
- This plan initializes Git because the current directory is not a repository and superpowers expects task commits.
