<template>
	<v-col class='' cols='12'>
		<v-row align='center' class='no-gutters mb-2' justify='center'>
			<v-col class='pa-0' cols='auto'>
				<v-btn
					class='fab-fix elevation-0'
					:color='infoColor'
					:dark='!loading'
					:disabled='localLoading || loading'
					min-width='30vw'
					rounded
					:size='mobile ? `small` : `default`'
					@click='visibility'
				>
					<v-icon class='mr-1' :icon='mdiMapClock' size='small' style='vertical-align: middle;' />
					time
					<v-icon class='ml-1' :icon='computedInfoIcon' size='small' style='vertical-align: middle;' />
				</v-btn>
			</v-col>
		</v-row>
		<v-expand-transition>
			<section v-if='visible'>
				<v-row align='center' class='no-gutters' justify='space-around'>
					<v-col cols='auto'>
						<p class='text-center' :class='confirmFont'>{{ computedTimezoneText }}</p>
						<p v-if='timeZone' class='text-center'>current timezone: {{ timeZone }}</p>
					</v-col>
				</v-row>
				<v-form autocomplete='off' method='post' @submit.prevent>
					<v-row align='center' justify='space-around' no-gutters>
						<v-col class='' cols='10' sm='5'>
							<v-select
								v-model='timeZoneRegion'
								color='primary'
								density='compact'
								:disabled='!piOnline || localLoading'
								:items='parents'
								label='Region'
								variant='outlined'
							/>
						</v-col>
						<v-col class='' cols='10' sm='5'>
							<v-select
								v-model='timeZoneCity'
								color='primary'
								density='compact'
								:disabled='!piOnline || localLoading'
								item-text='text'
								item-value='value'
								:items='computedCity'
								label='City'
								no-data-text='Select a region first'
								variant='outlined'
							/>
						</v-col>
					</v-row>
					<v-row align='center' justify='space-around' no-gutters>
						<v-col cols='auto'>
							<v-row class='' justify='space-around'>
								<v-col class='' cols='auto'>
									<v-btn
										class='elevation-0'
										color='red'
										:dark='!localLoading'
										:disabled='localLoading'
										rounded
										:size='mobile ? `small` : `default`'
										variant='outlined'
										@click='visibility'
									>
										<span>
											<v-icon
												class='mr-2'
												:icon='mdiClose'
												size='small'
												style='vertical-align: middle;'
											/>
											cancel
										</span>
									</v-btn>
								</v-col>
								<v-col class='' cols='auto'>
									<v-btn
										class='elevation-0'
										color='success'
										:disabled='localLoading || !timeZoneCity'
										rounded
										:size='mobile ? `small` : `default`'
										:variant='!updateDisabled ? "outlined" : "flat"'
										@click='setTimeZone'
									>
										<v-icon
											class='mr-1'
											:color='!updateDisabled ? "black" : "white"'
											:icon='mdiUpdate'
											style='vertical-align: middle;'
										/>
										<span :class='updateColor'>update</span>
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
import type { Ref } from 'vue'
import type { su, TComputedCity } from '@/types'
import {
	mdiChevronDown,
	mdiChevronUp,
	mdiClose,
	mdiMapClock,
	mdiUpdate,
} from '@mdi/js'
import { useDisplay } from 'vuetify'

import { parents, zones } from '@/services/tz'

const { mobile } = useDisplay()
const [loadingStore, piStatusStore, wsStore] = [loadingModule(), piStatusModule(), wsModule()]

onUnmounted(() => {
	clearTimeout(timezoneTimeout.value);
	[timeZoneRegion.value, timeZoneCity.value] = [undefined, undefined]
})
const updateColor = computed(() => updateDisabled.value
	? 'text-white'
	: 'text-black')
const updateDisabled = computed(() => localLoading.value || timeZoneCity.value)
const infoColor = computed(() => visible.value
	? 'danger'
	: 'black')
const computedInfoIcon = computed(() => visible.value
	? mdiChevronUp
	: mdiChevronDown)

const computedTimeZone = computed(() => timeZoneCity.value
	? new Date().toLocaleString('en-GB', { timeZone: timeZoneCity.value })
	: '')
const computedCity = computed((): Array<TComputedCity> => {
	if (!timeZoneRegion.value) return []
	const data = []
	for (const i of zones) if (i.startsWith(timeZoneRegion.value)) data.push({
		value: i,
		title: i.slice(Math.max(0, timeZoneRegion.value.length + 1)).replace('_', ' '),
	})
	return data
})

const computedTimezoneText = computed(() => timeZoneRegion.value
	? (timeZoneCity.value
		? `Change to : ${timeZoneCity.value} ${computedTimeZone.value}`
		: 'Now select a city')
	: 'To change time zone, first select a region')
const confirmFont = computed(() => mobile.value
	? 'text-caption'
	: 'text-body-1')

const loading = computed({
	get (): boolean {
		return loadingStore.loading
	},
	set (b: boolean): void {
		loadingStore.set_loading(b)
	},
})
const piOnline = computed(() => piStatusStore.online)
const timeZone = computed(() => piStatusStore.timeZone)

const localLoading = ref(false)
const timeZoneCity: Ref<su> = ref(undefined)
const timeZoneRegion: Ref<su> = ref(undefined)
const timezoneTimeout = ref(0)
const visible = ref(false)

function setTimeZone (): void {
	if (!timeZoneCity.value || loading.value) return;
	[localLoading.value, loading.value] = [true, true]
	wsStore.send({
		name: 'time_zone',
		body: { zone: timeZoneCity.value },
	})
	timezoneTimeout.value = window.setTimeout(async () => {
		wsStore.send({ name: 'status' })
		visible.value = false
		clear()
	}, 500)
}

function clear (): void {
	localLoading.value = false
	loading.value = false
	timeZoneRegion.value = undefined
	timeZoneCity.value = undefined
}

function visibility (): void {
	visible.value = !visible.value
	clear()
}
</script>
