<template>
	<v-card-text class='text-center'>
		<v-row align='center' class='mb-2' justify='center' no-gutters>
			<v-col cols='auto'>
				<v-btn
					class='elevation-0'
					:color='buttonColor'
					:dark='expandedAdd'
					:disabled='loading && piInit || !piOnline && piInit'
					:outlined='expandedAdd'
					rounded
					size='large'
					:variant='expandedAdd ? "outlined" : "flat"'
					@click='expandMethod'
				>
					<v-row
						align='center'
						class=''
						fill-height
						justify='center'
						no-gutters
					>
						<v-col cols='auto'>
							<v-icon
								class='mr-2'
								:color='expandedAdd ? "" : "white"'
								:icon='buttonIcon'
								style='vertical-align: middle;'
							/>
						</v-col>
						<v-col :class='expandedAdd ? "" : "text-white"' cols='auto'>
							{{ buttontext }}
						</v-col>
					</v-row>
				</v-btn>
			</v-col>
		</v-row>
		<v-expand-transition>
			<div v-if='expandedAdd' class=''>
				<v-row fill-height justify='center'>
					<v-col class='' cols='12'>
						<v-row justify='center'>
							<v-col cols='12' md='5'>
								<v-select
									v-model='chosenHour'
									color='primary'
									:items='hours'
									label='Select Hour'
									:messages='messagesHour'
									variant='outlined'
								/>
							</v-col>
							<v-col cols='12' md='5'>
								<v-select
									v-model='chosenMinute'
									color='primary'
									:items='minutes'
									label='Select Minute'
									:messages='messagesMinute'
									variant='outlined'
								/>
							</v-col>
						</v-row>
						<v-row align='center' justify='space-around'>
							<v-checkbox
								v-for='i in dayOptions'
								:key='i.value'
								v-model='daysSelected'
								class='days mb-n3 pa-0'
								color='primary'
								:label='i.text'
								:value='i.value'
							/>
							<v-col class='' cols='12' sm='auto'>
								<v-btn
									v-if='daysSelected.length < 7'
									class='elevation-0 text-white'
									color='secondary'
									:disabled='loading'
									rounded
									size='small'
									@click='daysSelected = [0, 1, 2, 3, 4, 5, 6]'
								>
									<span class='text-white'>all</span>
								</v-btn>
								<v-btn
									v-else
									class='elevation-0 text-white'
									color='secondary'
									dark
									:disabled='loading'
									rounded
									size='small'
									variant='outlined'
									@click='daysSelected = []'
								>
									<span class=''>nil</span>
								</v-btn>
							</v-col>
							<v-col class='pa-0 ma-0' cols='12'>
								<v-expand-transition>
									<v-row v-if='messagesDays' justify='center'>
										<v-col cols='12'>
											<span class='v-messages'>{{ messagesDays }}</span>
										</v-col>
									</v-row>
								</v-expand-transition>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row align='center' class='' justify='center'>
					<v-col class=''>
						<v-btn
							class='elevation-0'
							color='primary'
							:disabled='loading || !piOnline'
							rounded
							size='large'
							@click='addAlarm'
						>
							<v-icon class='mr-2' color='white' :icon='mdiAlarmPlus' style='vertical-align: middle;' />
							<span class='text-white'>Add</span>
						</v-btn>
					</v-col>
					<v-col cols='12'>
						<v-divider />
					</v-col>
				</v-row>
			</div>
		</v-expand-transition>
	</v-card-text>
</template>

<script setup lang='ts'>
import type { Ref } from 'vue'
import type { su } from '@/types'
import { mdiAlarmPlus, mdiAlert, mdiClose, mdiPlus } from '@mdi/js'
import { dayOptions } from '@/services/dayOptions'
import { snackError } from '@/services/snack'

const [alarmStore, piStatusStore, wsStore] = [alarmModule(), piStatusModule(), wsModule()]

const buttonColor = computed(() => expandedAdd.value ? 'red' : 'primary')
const buttonIcon = computed(() => expandedAdd.value ? mdiClose : mdiPlus)
const buttontext = computed(() => expandedAdd.value ? 'cancel' : 'new alarm')
const hours = computed((): Array<string> => {
	const hours = []
	for (const [index] of Array.from({ length: 24 }).entries()) hours.push(String(index).padStart(2, '0'))
	return hours
})
const minutes = computed((): Array<string> => {
	const minutes = []
	for (const [index] of Array.from({ length: 60 }).entries()) minutes.push(String(index).padStart(2, '0'))
	return minutes
})
const piInit = computed(() => piStatusStore.init)
const piOnline = computed(() => piStatusStore.online)

const chosenHour: Ref<su> = ref(undefined)
const chosenMinute: Ref<su> = ref(undefined)
const loading = ref(false)
const daysSelected: Ref<Array<number>> = ref([])
const expandedAdd = ref(false)
const messagesDays: Ref<su> = ref(undefined)
const messagesHour: Ref<su> = ref(undefined)
const messagesMinute: Ref<su> = ref(undefined)

function clearSelections (): void {
	chosenHour.value = undefined
	chosenMinute.value = undefined
	messagesHour.value = undefined
	messagesMinute.value = undefined
	messagesDays.value = undefined
	daysSelected.value = []
}

function expandMethod (): void {
	expandedAdd.value = !expandedAdd.value
	clearSelections()
}

function addAlarm (): void {
	let alarmClash = false
	if (!chosenHour.value) messagesHour.value = 'You need to select an hour'
	if (!chosenMinute.value) messagesMinute.value = 'You need to select an minute'
	if (daysSelected.value.length === 0) messagesDays.value = 'You need to select an day'
	if (!chosenHour.value || !chosenMinute.value || daysSelected.value.length === 0) return

	const current = alarmStore.get_alarms
	if (current) {
		for (const day of daysSelected.value) {
			const a = current.findIndex(i => i.day === day && i.hour === Number(chosenHour) && i.minute === Number(chosenMinute))
			if (a !== -1) alarmClash = true
			break
		}
	}
	if (alarmClash) {
		snackError({
			message: 'An alarm is already set for that time & day',
			icon: mdiAlert,
		})
		clearSelections()
	} else {
		const wsBody = {
			hour: Number(chosenHour.value),
			minute: Number(chosenMinute.value),
			days: daysSelected.value,
		}
		wsStore.send({
			name: 'add_alarm',
			body: wsBody,
		})
		expandMethod()
	}
}

watch(chosenHour, i => {
	if (i) messagesHour.value = undefined
})

watch(chosenMinute, i => {
	if (i) messagesMinute.value = undefined
})

watch(daysSelected, i => {
	if (i) messagesDays.value = undefined
})

</script>

<style scoped>
.days .v-label {
    font-size: .9rem !important;
}
</style>
