<template>
	<v-card-actions class='mt-2'>
		<v-spacer />
		<v-btn
			@click='signOut'
			class='elevation-0'
			color='red'
			dark
			small
		>
			<v-icon style='vertical-align: middle;' class='mr-2' small dark>{{ mdiLogoutVariant }}</v-icon>
			<span>signout</span>
		</v-btn>
	</v-card-actions>
</template>

<script lang='ts'>
import Vue from 'vue';

import { mapStores } from 'pinia';
import { mdiLogoutVariant } from '@mdi/js';
import { userModule, wsModule } from '@/store';

export default Vue.extend({
	name: 'signout-components',
	
	computed: {
		...mapStores(userModule, wsModule)
	},

	data: () => ({
		mdiLogoutVariant
	}),
	
	methods: {
		async signOut (): Promise<void> {
			this.websocketStore.closeWS();
			this.userStore.signout();

		}
	}
});
</script>