<template>
	<v-col cols='12' class=''>
		<v-row
			v-if='$vuetify.breakpoint.smAndDown'
			align='center'
			class='no-gutters'
			justify='center'
		>
			<v-col cols='auto' class='pa-0'>
				<v-btn
					@click='visible =!visible'
					:color='infoColor'
					:dark='!loading'
					:disabled='loading'
					:small='$vuetify.breakpoint.smAndDown'
					class='fab-fix elevation-0'
					min-width='30vw'
					rounded
				>
					<v-icon style='vertical-align: middle;' class='mr-1' small >{{ mdiIpNetwork }}</v-icon>
					info
					<v-icon style='vertical-align: middle;' class='ml-1' small >{{ computedInfoIcon }}</v-icon>
				</v-btn>
			</v-col>
		</v-row>
		<v-expand-transition>
			<section v-if='visible'>
				<app-ip />

				<v-expand-transition >
					<app-uptime v-if='piOnline' />
				</v-expand-transition>

			</section>
		</v-expand-transition>
	</v-col>
</template>

<script lang='ts'>
import Vue from 'vue';

import { loadingModule, piStatusModule } from '@/store';
import { mapStores } from 'pinia';
import { mdiChevronDown, mdiChevronUp, mdiIpNetwork } from '@mdi/js';
import Ip from '@/components/Authenticated/Settings/Ip.vue';
import Uptime from '@/components/Authenticated/Settings/Uptime.vue';

export default Vue.extend({
	name: 'pi-info-row',

	components: {
		appUptime: Uptime,
		appIp: Ip,
	},

	beforeMount () {
		this.visible = this.$vuetify.breakpoint.mdAndUp;
	},

	computed: {
		...mapStores(loadingModule, piStatusModule),
		computedInfoIcon (): string {
			return this.visible ? mdiChevronUp : mdiChevronDown;
		},
		infoColor (): string {
			return this.visible ? 'danger' : 'black';
		},
		loading: {
			get (): boolean {
				return this.loadingStore.loading;
			},
			set (b: boolean): void {
				this.loadingStore.set_loading(b);
			}
		},
		piOnline (): boolean {
			return this.piStatusStore.online;
		},
	},

	data: () => ({
		mdiIpNetwork,
		visible: false,
	}),

});
</script>