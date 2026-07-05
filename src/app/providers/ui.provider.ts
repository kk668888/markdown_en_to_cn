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
