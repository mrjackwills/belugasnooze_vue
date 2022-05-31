<template>
	<v-col cols='12' class=''>
		<v-row align='center' justify='center' class='no-gutters'>
			<v-col cols='auto' class='pa-0'>
				<v-btn
					@click='visibility'
					:color='infoColor'
					:dark='!loading'
					:disabled='localLoading || loading'
					:small='$vuetify.breakpoint.smAndDown'
					class='fab-fix elevation-0'
					min-width='30vw'
					rounded
				>
					<v-icon style='vertical-align: middle;' class='mr-1' small >{{ mdiMapClock }}</v-icon>
					time
					<v-icon style='vertical-align: middle;' class='ml-1' small >{{ computedInfoIcon }}</v-icon>
				</v-btn>
			</v-col>
		</v-row>
		<v-expand-transition>
			<section v-if='visible'>
				<v-row align='center' justify='space-around' class='no-gutters'>
					<v-col cols='auto' class='mt-4 mb-n4'>
						<p class='text-center' :class='confirmFont'>{{ computedTimezoneText }}</p>
						<p v-if='timeZone' class='text-center' >current timezone: {{ timeZone }}</p>
					</v-col>
				</v-row>
				<v-form
					v-on:submit.prevent
					autocomplete='off'
					method='post'
				>
					<v-row align='center' justify='space-around' no-gutters>
						<v-col cols='10' sm='7' class=''>
							<v-select
								v-model='timeZoneRegion'
								:disabled='!piOnline || localLoading'
								:items='timeZoneParents'
								label='Region'
							/>
						</v-col>
						<v-col cols='10' sm='7' class='' >
							<v-select
								v-model='timeZoneCity'
								:disabled='!piOnline || localLoading'
								:items='computedCity'
								item-text='text'
								item-value='value'
								label='City'
								no-data-text='Select a region first'
							/>
						</v-col>
					</v-row>
					<v-row align='center' justify='space-around' no-gutters>
						<v-col cols='auto' >
							<v-row justify='space-around' class=''>
								<v-col cols='auto' class=''>
									<v-btn
										@click='visibility'
										:dark='!localLoading'
										:disabled='localLoading'
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
								<v-col cols='auto' class=''>
									<v-btn
										@click='setTimeZone'
										:disabled='localLoading || !timeZoneCity'
										:small='$vuetify.breakpoint.smAndDown'
										class='elevation-0'
										color='success'
										rounded
									>
										<v-icon style='vertical-align: middle;' class='mr-1'>
											{{ mdiUpdate }}
										</v-icon>
										update
									</v-btn>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-form>
			</section>
		</v-expand-transition>
	</v-col>
</template>

<script lang='ts'>
import Vue from 'vue';
	
import { loadingModule, piStatusModule, wsModule } from '@/store';
import { mapStores } from 'pinia';
import { parents, zones } from '@/vanillaTS/tz';
import { TComputedCity } from '@/types';
import {
	mdiChevronDown,
	mdiChevronUp,
	mdiClose,
	mdiMapClock,
	mdiUpdate,
} from '@mdi/js';

export default Vue.extend({
	name: 'timezone-component',

	beforeDestroy () {
		clearTimeout(this.timezoneTimeout);
		[ this.timeZoneRegion, this.timeZoneCity ] = [ undefined, undefined ];
	},

	computed: {
		...mapStores(loadingModule, piStatusModule, wsModule),
		infoColor (): string {
			return this.visible ? 'danger' : 'black';
		},
		computedInfoIcon (): string {
			return this.visible ? mdiChevronUp : mdiChevronDown;
		},
		computedTimeZone (): string {
			if (!this.timeZoneCity) return '';
			return new Date().toLocaleString('en-GB', { timeZone: this.timeZoneCity });
		},
		computedCity (): Array<TComputedCity> {
			if (!this.timeZoneRegion) return [];
			const data = [];
			for (const i of this.timeZoneChildren) if (i.startsWith(this.timeZoneRegion)) data.push({ value: i, text: i.substring(this.timeZoneRegion.length + 1).replace('_', ' ') });
			return data;
		},
		computedTimezoneText (): string {
			return !this.timeZoneRegion ? 'To change time zone, first select a region' : !this.timeZoneCity? 'Now select a city' : `Change to : ${this.timeZoneCity} ${this.computedTimeZone}`;
		},
		confirmFont (): string {
			return this.$vuetify.breakpoint.smAndDown ? 'text-caption' : 'text-body-1';
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
		timeZone (): string {
			return this.piStatusStore.timeZone;
		},
		showInstructions (): boolean {
			return this.timeZoneRegion && this.timeZoneCity ? false : true;
		}
	},

	data: () => ({
		localLoading: false,
		mdiClose,
		mdiMapClock,
		mdiUpdate,
		timeZoneChildren: zones,
		timeZoneCity: undefined as string | undefined,
		timeZoneParents: parents,
		timeZoneRegion: undefined as string | undefined,
		timezoneTimeout: 0,
		visible: false,
	}),

	methods: {
		setTimeZone (): void {
			if (!this.timeZoneCity || this.loading) return;
			[ this.localLoading, this.loading ] = [ true, true ];
			this.websocketStore.send({ name: 'time_zone', body: { zone: this.timeZoneCity } });
			this.$vuetify.goTo(0);
			this.timezoneTimeout = window.setTimeout(async () => {
				this.websocketStore.send({ name: 'status' });
				this.visible = false;
				this.clear();
			}, 500);
		},
		clear (): void {
			this.localLoading = false;
			this.loading = false;
			this.timeZoneRegion = undefined;
			this.timeZoneCity = undefined ;
		},
		visibility (): void {
			this.visible = !this.visible;
			this.clear();
		}
	}
});
</script>