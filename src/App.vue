<template>
	<v-app container--fluid fill-height class='ma-0 vh-fix'  id='belugasnooze'>
		<router-view />
		<app-snackbar />
		<app-footer />
	</v-app>
</template>

<script lang='ts'>
import Vue from 'vue';

import { loadingModule, userModule } from '@/store';
import { mapStores } from 'pinia';
import { snackSuccess } from './services/snack';
import debounce from 'lodash/debounce';
import Footer from '@/components/Footer.vue';
import Snackbar from '@/components/Snackbar.vue';

export default Vue.extend({
	name: 'belugasnooze-app',

	async beforeDestroy () {
		document.removeEventListener('updateEvent', this.appUpdate);
	},

	components: {
		appFooter: Footer,
		appSnackbar: Snackbar,
	},

	computed: {
		...mapStores(userModule, loadingModule),
		
		authenticated (): boolean {
			return this.userStore.authenticated;
		},
		loading: {
			get (): boolean {
				return this.loadingStore.loading;
			},
			set (b: boolean): void {
				this.loadingStore.set_loading(b);
			}
		},
	},

	async created () {
		document.addEventListener('updateEvent', this.appUpdate);
	},

	metaInfo: {
		titleTemplate: (titleChunk): string => titleChunk ? `Beluga Snooze - ${titleChunk}` : 'Beluga Snooze',
		meta: [
			{ name: 'description', content: `Beluga Snooze - Those in the know - know, everybody else, well I guess that's just tough luck` }
		],
		link: [
			{ rel: 'canonical', href: `https://www.belugasnooze.com` }
		]
		
	},
	methods: {
		appUpdate (): void {
			snackSuccess({ message: 'Downloading Updates', loading: true, timeout: 4500 });
			window.setTimeout(() => location.reload(), 5000);
		},
		setViewHeight (): void {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		},
	},
	mounted () {
		this.setViewHeight();

		const debouncedSetHeight = debounce(this.setViewHeight, 50);

		window.addEventListener('resize', debouncedSetHeight);

		this.$once('destroyed', () => {
			window.removeEventListener('resize', debouncedSetHeight);
		});
	},
});
</script>

<style scoped lang="scss">

.vh-fix ::v-deep .v-application--wrap {
	min-height: 100vh;
	min-height: calc(var(--vh, 100vh) * 100);
}
</style>