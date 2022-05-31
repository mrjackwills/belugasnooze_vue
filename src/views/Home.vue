<template>
	<v-main>
		<v-container
			class='fill-height'
			fluid
		>
			<v-row
				align='center'
				justify='center'
			>
				<v-col cols='10' md='8' >
					<v-card transition='fade-transition' class='mb-4' >
						<app-toolbar />
						<v-card-text class=''>
							<v-fade-transition group hide-on-leave>
								<component
									:key='computedComponent'
									:is='computedComponent'
								/>
							</v-fade-transition>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-main>
</template>

<script lang='ts'>
import Vue from 'vue';

import { lightModule, userModule } from '@/store';
import { mapStores } from 'pinia';
import { MetaInfo } from 'vue-meta';
import Footer from '@/components/Footer.vue';
import Signin from '@/components/Signin.vue';
import Snackbar from '@/components/Snackbar.vue';
import Toolbar from '@/components/Toolbar.vue';

export default Vue.extend({
	name: 'home-component',
	components: {
		appAuthenticated: () => import(/* webpackChunkName: "authenticated-card" */ /* webpackMode: "lazy" */'@/components/Authenticated.vue'),
		appFooter: Footer,
		appLoginCard: Signin,
		appSnackbar: Snackbar,
		appToolbar: Toolbar,
	},

	computed: {
		...mapStores(lightModule, userModule),

		authenticated (): boolean {
			return this.userStore.authenticated;
		},
		computedComponent (): string {
			return this.authenticated ? 'app-authenticated' : 'app-login-card';
		},
		lightOn (): boolean {
			return this.lightStore.on;
		},
	},

	data: () => ({
		pageTitle: ''
	}),

	metaInfo (): MetaInfo {
		return {
			title: this.authenticated ? this.pageTitle : ''
		};
	},

	watch: {
		lightOn (i): void {
			this.pageTitle = i ? 'light on 💡' : '';
		}
	},
});
</script>