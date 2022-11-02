<template>
	<v-col cols='12' class=''>
		<v-row align='center' justify='center' class='no-gutters mb-2' >
			<v-col cols='auto' class='pa-0'>
				<v-btn
					@click='visibility'
					:color='infoColor'
					:dark='!loading'
					:disabled='localLoading || loading'
					:size='mobile ? `small`:`default`'
					class='fab-fix elevation-0'
					min-width='30vw'
					rounded
				>
					<v-icon style='vertical-align: middle;' class='mr-1' size='small' :icon='mdiMapClock' />
					time
					<v-icon style='vertical-align: middle;' class='ml-1'  size='small' :icon='computedInfoIcon' />
				</v-btn>
			</v-col>
		</v-row>
		<v-expand-transition>
			<section v-if='visible'>
				<v-row align='center' justify='space-around' class='no-gutters'>
					<v-col cols='auto'>
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
								:items='parents'
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
										:size='mobile ? `small`:`default`'
										class='elevation-0'
										color='red'
										rounded
										outlined
									>
										<span>
											<v-icon small style='vertical-align: middle;' class='mr-2' :icon='mdiClose' />
											cancel
										</span>
									</v-btn>
								</v-col>
								<v-col cols='auto' class=''>
									<v-btn
										@click='setTimeZone'
										:disabled='localLoading || !timeZoneCity'
										:size='mobile ? `small`:`default`'
										class='elevation-0'
										color='success'
										rounded
									>
										<v-icon :color='localLoading || timeZoneCity ? "white" : "grey"' style='vertical-align: middle;' class='mr-1' :icon='mdiUpdate' />
										<span class='text-white'>update</span>
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

<script setup lang='ts'>
import { parents, zones } from '@/services/tz';
import type { su, TComputedCity } from '@/types';
import type { Ref } from 'vue';
import {
	mdiChevronDown,
	mdiChevronUp,
	mdiClose,
	mdiMapClock,
	mdiUpdate,
} from '@mdi/js';

import { useDisplay, } from 'vuetify';

const { mobile } = useDisplay();
const [ loadingStore, piStatusStore, wsStore ] = [ loadingModule(), piStatusModule(), wsModule() ];

onUnmounted(() => {
	clearTimeout(timezoneTimeout.value);
	[ timeZoneRegion.value, timeZoneCity.value ] = [ undefined, undefined ];
});

const infoColor = computed((): string =>{
	return visible.value ? 'danger' : 'black';
});
const computedInfoIcon = computed((): string =>{
	return visible.value ? mdiChevronUp : mdiChevronDown;
});
const computedTimeZone = computed((): string =>{
	if (!timeZoneCity.value) return '';
	return new Date().toLocaleString('en-GB', { timeZone: timeZoneCity.value });
});
const computedCity = computed((): Array<TComputedCity> =>{
	if (!timeZoneRegion.value) return [];
	const data = [];
	for (const i of zones) if (i.startsWith(timeZoneRegion.value)) data.push({ value: i, title: i.substring(timeZoneRegion.value.length + 1).replace('_', ' ') });
	return data;
});
const computedTimezoneText = computed((): string =>{
	return !timeZoneRegion.value ? 'To change time zone, first select a region' : !timeZoneCity.value? 'Now select a city' : `Change to : ${timeZoneCity.value} ${computedTimeZone.value}`;
});
const confirmFont = computed((): string =>{
	return mobile.value ? 'text-caption' : 'text-body-1';
});
const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});
const piOnline =computed((): boolean => {
	return piStatusStore.online;
});
const timeZone =computed((): string => {
	return piStatusStore.timeZone;
});

const localLoading = ref(false);
const timeZoneCity: Ref<su> = ref(undefined);
const timeZoneRegion: Ref<su> = ref(undefined);
const timezoneTimeout = ref(0);
const visible = ref(false);

const setTimeZone = (): void => {
	if (!timeZoneCity.value || loading.value) return;
	[ localLoading.value, loading.value ] = [ true, true ];
	wsStore.send({ name: 'time_zone', body: { zone: timeZoneCity.value } });
	// $vuetify.goTo(0);
	// fix me
	timezoneTimeout.value = window.setTimeout(async () => {
		wsStore.send({ name: 'status' });
		visible.value = false;
		clear();
	}, 500);
};

const clear = (): void => {
	localLoading.value = false;
	loading.value = false;
	timeZoneRegion.value = undefined;
	timeZoneCity.value = undefined ;
};

const visibility = (): void => {
	visible.value = !visible.value;
	clear();
};
</script>