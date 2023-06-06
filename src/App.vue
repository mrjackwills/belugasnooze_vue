<template>
	<v-app class='ma-0 pa-0' id='belugasnooze'>
		<v-main>
			<RouterView />
			<AppSnackbar />
			<AppFooter />
		</v-main>
  
	</v-app>
</template>

<script setup lang="ts">
import { snackSuccess } from '@/services/snack';
import { useHead } from '@vueuse/head';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { registerSW } from 'virtual:pwa-register';

const { updateServiceWorker } = useRegisterSW();
const store = pagetitleModule();

if ('serviceWorker' in navigator) {
	registerSW({
		onNeedRefresh () {
			appUpdate();

		}
	});
}

const title = computed(() => {
	return store.title;
});

useHead({
	title: () => {
		if (title.value.length > 0) {
			return `Beluga Snooze - ${title.value}`;
		} else {
			return `Beluga Snooze`;
		}
	},

	meta: [
		{
			name: `description`,
			content: `Beluga Snooze - Those in the know - know, everybody else, well I guess that's just tough luck`,
		},
	],
	link: [ { rel: 'canonical', href: `https://www.belugasnooze.com` } ],
});

const appUpdate = (): void => {
	snackSuccess({
		message: 'Downloading Updates',
		loading: true,
		timeout: 4500,
	});
	window.setTimeout(() => updateServiceWorker(), 5000);
	
};

</script>