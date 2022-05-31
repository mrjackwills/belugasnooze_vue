<template>
	<v-col cols='12' class=''>
		<div class='text-center ' id='restartserver'>
			<v-btn
				@click='expandedReset = !expandedReset'
				:class='{"elevation-0": !expandedReset}'
				:color='(expandedReset)? "red" : "primary"'
				:dark='expandedReset'
				:disabled='localLoading || loading'
				:outlined='expandedReset'
				ref='resetButton'
				rounded
			>
				<v-icon small style='vertical-align: middle;' class='mr-1'>
					{{ computedRestartButton }}
				</v-icon>
				<span v-if='!expandedReset'>restart server</span>
				<span v-else>cancel</span>
			</v-btn>
		</div>
		<v-expand-transition>
			<div v-if='expandedReset' class=''>
				<section>
					<v-row justify='center' class=''>
						<v-col cols='auto' class='text-center'>
							<span :class='restartFont'>Are you sure you want to restart the pi and the server?</span>
						</v-col>
					</v-row>
					<v-row justify='center' class=''>
						<v-col cols='auto' class=''>
							<v-btn
								@click='serverRestart'
								:disabled='localLoading'
								class='elevation-0 '
								color='serious'
								rounded
								small
							>
								<span class='white--text'>confirm restart</span>
							</v-btn>
						</v-col>
					</v-row>
				</section>
			</div>
		</v-expand-transition>
	</v-col>
</template>

<script lang='ts'>
import Vue from 'vue';

import { loadingModule, settingsModule, userModule, wsModule } from '@/store';
import { mapStores } from 'pinia';
import { mdiClose, mdiRestartAlert } from '@mdi/js';

export default Vue.extend({
	name: 'restart-component',

	beforeDestroy () {
		this.expandedReset = false;
	},

	computed: {
		...mapStores(loadingModule, settingsModule, userModule, wsModule),
		computedRestartButton (): string {
			return this.expandedReset ? mdiClose : mdiRestartAlert;
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
		restartFont (): string {
			return this.$vuetify.breakpoint.smAndDown ? 'text-caption' : 'text-h6';
		},
	},

	data: () => ({
		expandedReset: false,
		localLoading: false,
		mdiClose,
	}),

	methods: {
		async serverRestart (): Promise<void> {
			try {
				if (this.loading) return;
				this.loading = true;
				this.websocketStore.send({ name: 'restart' });
				this.$vuetify.goTo(0);
				this.expandedReset = false;
				this.websocketStore.closeWS();
				window.setTimeout(() => {
					try {
						this.userStore.signout();
						this.loading = false;
					} catch (e) {
						throw e;
					}
				}, 5000);
			} catch (e) {
				this.userStore.signout();
				this.websocketStore.closeWS();
				this.loading = false;
			}
		},
	},
});
</script>