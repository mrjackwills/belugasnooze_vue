<template>
	<v-app
		id='belugasnooze'
		class='ma-0 pa-0'
	>
		<v-main>
			<RouterView />
			<AppSnackbar />
			<AppFooter />
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { registerSW } from 'virtual:pwa-register'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { snackSuccess } from '@/services/snack'

const { updateServiceWorker } = useRegisterSW()
const store = pagetitleModule()

if ('serviceWorker' in navigator) {
	registerSW({
		onNeedRefresh () {
			appUpdate()
		},
	})
}

const title = computed(() => store.title)

useHead({
	title: () => {
		return title.value.length > 0 ? `Beluga Snooze - ${title.value}` : `Beluga Snooze`
	},

	meta: [
		{
			name: `description`,
			content: `Beluga Snooze - Those in the know - know, everybody else, well I guess that's just tough luck`,
		},
	],
	link: [
		{
			rel: 'canonical',
			href: `https://www.belugasnooze.com`,
		},
	],
})

function appUpdate (): void {
	snackSuccess({
		message: 'Downloading Updates',
		loading: true,
		timeout: 4500,
	})
	window.setTimeout(() => updateServiceWorker(), 5000)
}

</script>
