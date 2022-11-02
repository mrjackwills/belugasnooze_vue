<template>
	<v-card-text class='text-center'>
		<v-row no-gutters align='center' justify='center' class='mb-2'>
			<v-col cols='auto'>
				<v-btn
					@click='expandMethod'
					:color='buttonColor'
					:dark='expandedAdd'
					:disabled='loading && piInit || !piOnline && piInit'
					:variant='expandedAdd ? "outlined" : "flat"'
					:outlined='expandedAdd'
					class='elevation-0'
					large
					rounded
				>
					<v-row fill-height align='center' justify='center' no-gutters class=''>
						<v-col cols='auto'>
							<v-icon style='vertical-align: middle;' class='mr-2' :icon='buttonIcon' :color='expandedAdd ? "":"white"' />
						</v-col>
						<v-col cols='auto' :class='expandedAdd ? "":"text-white"'>
							{{ buttontext }}
						</v-col>
					</v-row>
				</v-btn>
			</v-col>
		</v-row>
		<v-expand-transition>
			<div v-if='expandedAdd' class=''>
				<v-row justify='center' fill-height >
					<v-col cols='12' class=''>
						<v-row justify='center'>
							<v-col cols='12' md='5'>
								<v-select
									v-model='chosenHour'
									:items='hours'
									:messages='messagesHour'
									label='Select Hour'
									outline
								/>
							</v-col>
							<v-col cols='12' md='5'>
								<v-select
									v-model='chosenMinute'
									:items='minutes'
									:messages='messagesMinute'
									label='Select Minute'
									outline
								/>
							</v-col>
						</v-row>
						<v-row justify='space-around' align='center'>
							<v-checkbox
								v-for='i in dayOptions'
								v-model='daysSelected'
								:key='i.value'
								:label='i.text'
								:value='i.value'
								class='days mb-n3 pa-0'
								color='primary'
							/>
							<v-col cols='12' sm='auto' class='mt-md-1'>
								<v-btn
									v-if='daysSelected.length < 7'
									class='elevation-0 text-white'
									@click='daysSelected=[0,1,2,3,4,5,6]'
									:disabled='loading'
									color='secondary'
									size='small'
									rounded
								>
									<span class='text-white'>all</span>
								</v-btn>
								<v-btn
									v-else
									class='elevation-0 text-white'
									@click='daysSelected=[]'
									:disabled='loading'
									color='secondary'
									size='small'
									rounded
									dark
								>
									<span class='text-white'>nil</span>
								</v-btn>
							</v-col>
							<v-col cols='12' class='pa-0 ma-0'>
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
				<v-row justify='center' align='center' class=''>
					<v-col class=''>
						<v-btn
							@click='addAlarm'
							:disabled='loading || !piOnline'
							class='elevation-0'
							color='primary'
							x-large
							rounded
						>
							<v-icon style='vertical-align: middle;' class='mr-2' :icon='mdiAlarmPlus' color='white' />
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
import type { Ref } from 'vue';
import { dayOptions } from '@/services/dayOptions';
import { mdiAlarmPlus, mdiAlert, mdiClose, mdiPlus } from '@mdi/js';
import type { nu, su } from '@/types';
import { snackError } from '@/services/snack';

const [ alarmStore, piStatusStore, wsStore ] = [ alarmModule(), piStatusModule(), wsModule() ];

const buttonColor = computed(() =>{
	return expandedAdd.value ? 'red': 'primary';
});
const buttonIcon = computed(() => {
	return expandedAdd.value ? mdiClose: mdiPlus;
});
const buttontext = computed(() =>{
	return expandedAdd.value ? 'cancel' : 'new alarm';
});
const hours = computed((): Array<string> => {
	const hours = [];
	for (const [ index, _item ] of new Array(24).entries()) hours.push(String(index).padStart(2, '0'));
	return hours;
});
const minutes = computed((): Array<string> => {
	const minutes = [];
	for (const [ index, _item ] of new Array(60).entries()) minutes.push(String(index).padStart(2, '0'));
	return minutes;
});
const piInit = computed(() =>{
	return piStatusStore.init;
});
const piOnline = computed(() => {
	return piStatusStore.online;
});

const chosenHour: Ref<nu> = ref(undefined);
const chosenMinute: Ref<nu> = ref(undefined);
const loading = ref(false);
const daysSelected: Ref<Array<number>> = ref([]);
const expandedAdd = ref(false);
const messagesDays: Ref<su> = ref(undefined);
const messagesHour: Ref<su> = ref(undefined);
const messagesMinute: Ref<su> = ref(undefined);

const clearSelections = (): void => {
	chosenHour.value = undefined;
	chosenMinute.value = undefined;
	messagesHour.value = undefined;
	messagesMinute.value = undefined;
	messagesDays.value = undefined;
	daysSelected.value = [];
};

const expandMethod = (): void => {
	expandedAdd.value = !expandedAdd.value;
	clearSelections();
};

const addAlarm = () : void => {
	let alarmClash = false;
	if (!chosenHour.value) messagesHour.value = 'You need to select an hour';
	if (!chosenMinute.value) messagesMinute.value = 'You need to select an minute';
	if (daysSelected.value.length === 0) messagesDays.value = 'You need to select an day';
	if (!chosenHour.value || !chosenMinute.value || daysSelected.value.length === 0) return;

	const current = alarmStore.get_alarms;
	if (current) {
		for (const day of daysSelected.value) {
			const a = current.findIndex((i) => i.day === day && i.hour === Number(chosenHour) && i.minute === Number(chosenMinute));
			if (a >= 0) alarmClash = true;
			break;
		}
	}
	if (alarmClash) {
		snackError({ message: 'An alarm is already set for that time & day', icon: mdiAlert });
		clearSelections();
	}
	else {
		const wsBody = { hour: Number(chosenHour.value), minute: Number(chosenMinute.value), days: daysSelected.value };
		wsStore.send({ name: 'add_alarm', body: wsBody });
		expandMethod();
	}
};

watch(chosenHour, (i) => {
	if (i) messagesHour.value = undefined;
});

watch(chosenMinute, (i) => {
	if (i) messagesMinute.value = undefined;
});

watch(daysSelected, (i) => {
	if (i) messagesDays.value = undefined;
});

</script>

<style scoped>
.days .v-label {
	font-size: .9rem!important;
}
</style>