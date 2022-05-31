<template>
	<v-col cols='12'>
		<v-row align='center' justify='center' class='no-gutters'>
			<v-col cols='auto' class='pa-0'>
				<v-btn
					@click='clear'
					:color='infoColor'
					:disabled='disabled'
					:small='$vuetify.breakpoint.smAndDown'
					class='fab-fix elevation-0'
					:dark='!disabled'
					rounded
					min-width='30vw'
				>
					<v-icon style='vertical-align: middle;' class='mr-1' small >{{ mdiAccessPointNetwork }}</v-icon>
					wifi
					<v-icon style='vertical-align: middle;' class='ml-1' small >{{ computedInfoIcon }}</v-icon>
				</v-btn>
			</v-col>
		</v-row>
		<v-expand-transition>
			<section v-if='visible'>
				<!-- <v-form
					v-on:submit.prevent
					autocomplete='off'
					method='post'
					class='mt-4'
				>
					<v-row align='center' justify='center'>
						<v-col cols='10' sm='7' class='pa-1'>
							<v-text-field
								v-model='ssid'
								@keydown.enter='addNetwork'
								:disabled='!piOnline'
								:prepend-icon='mdiWan'
								id='ssid'
								label='network name'
								type='text'
								hide-details
							/>
						</v-col>
						<v-col cols='10' sm='7' class='pa-1'>
							<v-text-field
								@click:append='show = !show'
								@keydown.enter='addNetwork'
								v-model='password'
								:append-icon='show ? mdiEye : mdiEyeOff'
								:disabled='!piOnline'
								:prepend-icon='mdiLock'
								:type='show ? "text" : "password"'
								autocomplete='new-password'
								label='network password'
								hide-details
							/>
						</v-col>
					</v-row>
				</v-form> -->

				<v-row align='center' justify='center' class='mt-2'>
					<v-col cols='auto' >
						<v-btn
							@click='clear'
							:dark='!loading'
							:disabled='loading'
							:small='$vuetify.breakpoint.smAndDown'
							color='red'
							rounded
							outlined
						>
							<span>
								<v-icon small style='vertical-align: middle;' class='mr-2' >
									{{ mdiClose }}
								</v-icon>
								cancel
							</span>
						</v-btn>
					</v-col>
					<!-- <v-col cols='auto' >
						<v-btn
							@click='addNetwork'
							:disabled='!piOnline || !ssid'
							:small='$vuetify.breakpoint.smAndDown'
							class='elevation-0'
							color='success'
							rounded
						>
							<v-icon style='vertical-align: middle;' class='mr-1'>
								{{ mdiPlusNetwork }}
							</v-icon>
							add new network
						</v-btn>
					</v-col> -->
				</v-row>
			</section>
		</v-expand-transition>
	</v-col>
</template>

<script lang='ts'>
import Vue from 'vue';
	
import { loadingModule, piStatusModule, wsModule } from '@/store';
import { mapStores } from 'pinia';
import {
	mdiAccessPointNetwork,
	mdiChevronDown,
	mdiChevronUp,
	mdiClose,
	mdiEye,
	mdiEyeOff,
	mdiLock,
	mdiPlusNetwork,
	mdiWan,
} from '@mdi/js';

export default Vue.extend({
	name: 'wifi-component',

	computed: {
		...mapStores(loadingModule, piStatusModule, wsModule),
		computedInfoIcon (): string {
			return this.visible ? mdiChevronUp: mdiChevronDown;
		},
		disabled () :boolean {
			return true;
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
		}
	},

	data: () => ({
		mdiEye,
		mdiEyeOff,
		mdiAccessPointNetwork,
		mdiLock,
		mdiClose,
		mdiPlusNetwork,
		mdiWan,
		password: undefined as string | undefined,
		show: false,
		ssid: undefined as string | undefined,
		visible: false,
	}),

	methods: {
		/**
		 ** emit a ws message with new wifi ssid and password, set password to 'NONE' if undefined
		 */
		// addNetwork (): void {
		// 	if (!this.ssid || this.loading) return;
		// 	this.show = false;
		// 	this.websocketStore.send({ name: 'wifi', body: { ssid: this.ssid, password: this.password ? this.password : 'NONE' } });
		// 	this.clear();
		// },
		clear (): void {
			this.ssid = undefined;
			this.password = undefined;
			this.visible = !this.visible;

		}
	}
});
</script>