/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue';
import { createPinia } from 'pinia';

// Composables
import { createApp } from 'vue';
import vuetify from './plugins/vuetify';
import router from './router';
import { createHead } from '@vueuse/head';

// import { registerSW } from 'virtual:pwa-register';

// const updateSW = registerSW({
// 	onNeedRefresh () {},
// 	onOfflineReady () {},
// });

// if ('serviceWorker' in navigator) {
// 	// && !/localhost/.test(window.location)) {
// 	registerSW();
// }

const head = createHead();

const app = createApp(App);
const pinia = createPinia();

app
	.use(head)
	.use(router)
	.use(pinia)
// .use(VueMeta)
	.use(vuetify)
	.mount('#app');
