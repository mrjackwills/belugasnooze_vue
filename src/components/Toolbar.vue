<template>
	<section>
		<v-toolbar
			class=''
			:height='`${toolbarHeight}px`'
			color='primary'
			dark
			flat
		>
			<v-toolbar-title
				:class='spacing'
				class='font-weight-bold'
			>
				<span>Beluga Snooze </span>
			</v-toolbar-title>
			<v-spacer />
			<app-status v-if='authenticated ' />
			<v-progress-linear
				:active='loading'
				:indeterminate='loading'
				:height='progressHeight'
				color='serious'
				absolute
				bottom
			/>
		</v-toolbar>
	</section>
</template>

<script lang='ts'>
import Vue from 'vue';

import { loadingModule, userModule } from '@/store';
import { mapStores } from 'pinia';

export default Vue.extend({
	name: 'toolbar-component',

	components: {
		appStatus: () => import(/* webpackChunkName: "status-card" */ /* webpackMode: "lazy" */'@/components/Authenticated/Toolbar/Status.vue'),
	},

	computed: {
		...mapStores(loadingModule, userModule),
		
		authenticated (): boolean {
			return this.userStore.authenticated;
		},
		loading (): boolean {
			return this.loadingStore.loading;
		},
		progressHeight (): string {
			return this.$vuetify.breakpoint.smAndDown ? '8' : '4';
		},
		spacing (): string {
			return this.$vuetify.breakpoint.xsOnly? 'text-h6 py-2' : 'text-h4 py-4';
		},
		toolbarHeight (): string {
			return this.$vuetify.breakpoint.xsOnly ? '56' : '70';
		},
	},
});
</script>