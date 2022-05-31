<template>
	<v-row align='center' justify='center' class='' >
		<v-col cols='12'>
			<v-row align='center' justify='center'>
				<v-col cols='auto '>
					<v-btn
						@click='showSettings'
						:disabled='loading && piInit'
						class='elevation-0 '
						:outlined='expandedSettings'
						:color='buttonColor'
						large
						rounded
					>
						<v-icon style='vertical-align: middle;' class='mr-1'>
							{{ buttonIcon }}
						</v-icon>
						<span> {{ buttonText }} </span>
					</v-btn>
				</v-col>
			</v-row>
		</v-col>
		<v-expand-transition>
			<section  v-if='expandedSettings'>
				<v-col class='pa-0 ma-0'>
					<v-row justify='center'>

						<app-refresh  @piStatus='piStatus' />

						<app-timezone @piStatus='piStatus' />
						
						<app-pi-info />

						<app-restart />
					</v-row>
					<app-signout />
				</v-col>
			</section>
		</v-expand-transition>
	</v-row>
</template>

<script lang='ts'>
import Vue from 'vue';

import { loadingModule, piStatusModule, settingsModule, wsModule } from '@/store';
import { mapStores } from 'pinia';
import { mdiClose, mdiCog, mdiRefresh, } from '@mdi/js';
import PiInfo from '@/components/Authenticated/Settings/PiInfo.vue';
import Refresh from '@/components/Authenticated/Settings/Refresh.vue';
import Restart from '@/components/Authenticated/Settings/Restart.vue';
import Signout from '@/components/Authenticated/Signout.vue';
import Timezone from '@/components/Authenticated/Settings/Timezone.vue';

export default Vue.extend({
	name: 'settings-component',

	components: {
		appPiInfo: PiInfo,
		appRefresh: Refresh,
		appRestart: Restart,
		appSignout: Signout,
		appTimezone: Timezone,
	},

	computed: {
		...mapStores(loadingModule, piStatusModule, settingsModule, wsModule),
		
		buttonColor (): string {
			return this.expandedSettings ? 'red': 'primary';
		},
		buttonIcon () : string {
			return this.expandedSettings ? mdiClose: mdiCog;
		},
		buttonText (): string {
			return this.expandedSettings ? 'close settings' : 'Settings';
		},
		expandedSettings: {
			get: function (): boolean {
				return this.settingsStore.expanded;
			},
			set: function (b: boolean): void {
				this.settingsStore.set_expanded(b);
			}
		},
		loading: {
			get (): boolean {
				return this.loadingStore.loading;
			},
			set (b: boolean): void {
				this.loadingStore.set_loading(b);
			}
		},
		piInit (): boolean {
			return this.piStatusStore.init;
		},
		restartFont (): string {
			return this.$vuetify.breakpoint.smAndDown ? 'text-caption' : 'text-h6';
		},
	},

	data: () => ({
		expandedReset: false,
		localLoading: false,
		mdiClose,
		mdiCog,
		mdiRefresh,
	}),

	methods: {
		piStatus (): void {
			this.websocketStore.send({ name: 'status' });

		},
		showSettings (): void {
			if (this.loading) return;
			this.expandedSettings = !this.expandedSettings;
			this.expandedReset = false;
		},
	},
});
</script>