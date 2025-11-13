import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

const head = createHead()

const app = createApp(App)
const pinia = createPinia()

app
	.use(head)
	.use(router)
	.use(pinia)
	.use(vuetify)
	.mount('#app')
