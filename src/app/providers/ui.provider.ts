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

/**
 * 注册本应用实际使用到的 ant-design-vue 组件。
 *
 * 采用「按需 use」而非全量注册，控制打包体积。
 * 注意：`<a-textarea>` 无需单独 use —— Input.install 已统一注册
 * Input / Group / Search / TextArea / Password 全部子组件。
 */
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
