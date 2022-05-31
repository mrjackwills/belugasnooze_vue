<template>
	<v-footer
		color='transparent'
		id='footer'
	>
		<v-row justify='center' align='center' class='no-gutters ma-0 pa-0'>

			<v-col cols='auto' class='no-gutters unselectable ma-0 pa-0'>
				
				<v-chip
					:ripple='false'
					class='not-cl elevation-0'
					color='offwhite'
					pill
				>
					<section v-if='showBuild' class='text-caption' @click='buildInfo'>
						<span>site version: {{ appVersion }}</span>
						<span class='ml-3 '>built: {{ buildDate }}</span>
					</section>

					<section v-else>
						<template>
							<a :href='href' target='_blank' rel='noopener noreferrer' clas='fff'>
								<v-icon color='black' class='mr-2' href=''>
									{{ mdiGithub }}
								</v-icon>
							</a>
						</template>
						<span @click='buildInfo'>
							mrjackwills 2021 -
						</span>
					</section>
					
				</v-chip>
			</v-col>
		</v-row>
			
	</v-footer>
</template>

<script lang='ts'>

// <template>
// 	<v-footer
// 		absolute
// 		padless
// 		color='transparent'
// 	>
// 		<v-row @click='buildInfo' justify='center' align='center' class='py-0 ma-0 no-gutters'>
// 			<v-col cols='auto' class='py-0 ma-0 no-gutters'>
// 				<span class='text-caption font-weight-black'><span v-if='showBuild'>site: </span>{{ appVersion }}</span>
// 				<span v-if='showBuild' class='text-caption font-weight-black ml-3'>build: {{ buildDate }}</span>
// 				<span v-if='showBuild' class='text-caption font-weight-black ml-3'>backend_version: {{ api_version }}</span>
// 			</v-col>
// 		</v-row>
			
// 	</v-footer>
// </template>

import Vue from 'vue';

import { mapStores } from 'pinia';
import { userModule, piStatusModule } from '@/store';
import { mdiGithub } from '@mdi/js';
import { env } from '@/vanillaTS/env';

export default Vue.extend({
	name: 'footer-component',

	async beforeDestroy () {
		clearTimeout(this.buildTimeout);
	},

	computed: {
		...mapStores(userModule),
		
		api_version (): string {
			return piStatusModule().piVersion;
		},
		authenticated (): boolean {
			return this.userStore.authenticated;
		},
		href (): string {
			return env.github.split('leafcast')[0] ?? '';
		}
	},

	data: () => ({
		appVersion: env.app_version,
		buildDate: env.build_date,
		buildTimeout: 0,
		showBuild: false,
		mdiGithub
	}),

	methods: {
		/**
		 ** Show build date on version number click if authed
		 */
		buildInfo (): void {
			if (!this.authenticated || this.showBuild) return;
			this.showBuild = !this.showBuild;
			clearTimeout(this.buildTimeout);
			this.buildTimeout = window.setTimeout(() => {
				this.showBuild = false;
			}, 10000);
		},
	},

	watch: {
		/**
		 ** Watch authenticated, remove showbuild if signouted
		 */
		authenticated (i: boolean): void {
			if (!i) this.showBuild = false;
		}
	},
});
</script>

<style scoped>
.lowercase-button{
	text-transform: lowercase;
}

a {
	color: #000000!important;
}
</style>