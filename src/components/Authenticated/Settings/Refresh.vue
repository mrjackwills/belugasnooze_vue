<template>
	<v-col cols='12' class=''>
		<v-row align='center' justify='center' class=''>
			<v-col cols='auto' class=''>
				<v-btn
					@click='piStatus'
					color='success'
					:disabled='loading'
					:dark='!loading'
					:small='$vuetify.breakpoint.smAndDown'
					class='fab-fix elevation-0'
					rounded
					min-width='30vw'
				>
					<v-icon style='vertical-align: middle;' class='mr-1' small >{{ mdiRefresh }}</v-icon>
					refresh data
				</v-btn>
			</v-col>
		</v-row>
	</v-col>
</template>

<script lang='ts'>
import Vue from 'vue';

import { mapStores } from 'pinia';
import { mdiRefresh, } from '@mdi/js';
import { loadingModule } from '@/store';

export default Vue.extend({
	
	name: 'refresh-component',

	computed: {
		...mapStores(loadingModule),
		loading: {
			get (): boolean {
				return this.loadingStore.loading;
			},
			set (b: boolean): void {
				this.loadingStore.set_loading(b);
			}
		},
	},

	data: () => ({
		mdiRefresh
	}),
	
	methods: {
		piStatus (): void {
			this.$emit('piStatus');
		}
	}
});
</script>