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
