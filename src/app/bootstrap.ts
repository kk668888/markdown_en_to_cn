import { createApp } from 'vue';

import App from '../App.vue';

export function bootstrap(): void {
  createApp(App).mount('#app');
}
