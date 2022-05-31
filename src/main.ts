import './registerServiceWorker';
import { createPinia, PiniaVuePlugin } from 'pinia';
import { env } from './vanillaTS/env';
import { VNode } from 'vue/types/umd';
import App from './App.vue';
import Meta from 'vue-meta';
import router from '@/router';
import Vue from 'vue';
import vuetify from '@/plugins/vuetify';

Vue.use(Meta);
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

Vue.config.productionTip = !!env.mode_production;

new Vue({
	router,
	vuetify,
	pinia,
	render: (r): VNode => r(App)
}).$mount('#belugasnooze');