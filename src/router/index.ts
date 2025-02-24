import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/Views/HomeView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{ 
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			redirect: { name: 'home' } 
		}
	]
});

export default router;
