<template>
	<v-card-text class='text-center'>
		<v-row no-gutters align='center' justify='center'>
			<v-col cols='auto'>
				<v-btn
					@click='expandMethod'
					:color='buttonColor'
					:dark='expandedAdd'
					:disabled='loading && piInit || !piOnline && piInit'
					:outlined='expandedAdd'
					class='elevation-0'
					large
					rounded
				>
					<v-row fill-height align='center' justify='center' no-gutters>
						<v-col cols='auto'>
							<v-icon style='vertical-align: middle;' class='mr-2'>
								{{ buttonIcon }}
							</v-icon>
						</v-col>
						<v-col cols='auto'>
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
							/>
							<v-col cols='12' sm='auto' class='mt-md-1'>
								<v-btn class='elevation-0'
									v-if='daysSelected.length < 7'
									@click='daysSelected=[0,1,2,3,4,5,6]'
									:disabled='loading'
									color='secondary'
									small
									rounded
								>
									all
								</v-btn>
								<v-btn class='elevation-0'
									v-else
									@click='daysSelected=[]'
									:disabled='loading'
									color='secondary'
									small
									rounded
								>
									nil
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
							<v-icon style='vertical-align: middle;' class='mr-2'>
								{{ mdiAlarmPlus }}
							</v-icon>
							Add
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

<script lang='ts'>
import Vue from 'vue';

import { alarmModule, piStatusModule, wsModule } from '@/store';
import { dayOptions } from '@/vanillaTS/dayOptions';
import { mapStores } from 'pinia';
import { mdiAlarmPlus, mdiAlert, mdiClose, mdiPlus } from '@mdi/js';
import { nu, su } from '@/types';
import { snackError } from '@/services/snack';

export default Vue.extend({
	name: 'add-alarm-component',

	computed: {
		...mapStores(alarmModule, piStatusModule, wsModule),

		buttonColor (): string {
			return this.expandedAdd ? 'red': 'primary';
		},
		buttonIcon () : string {
			return this.expandedAdd ? mdiClose: mdiPlus;
		},
		buttontext (): string {
			return this.expandedAdd ? 'cancel' : 'new alarm';
		},
		hours (): Array<string> {
			const hours = [];
			for (const [ index, _item ] of new Array(24).entries()) hours.push(String(index).padStart(2, '0'));
			return hours;
		},
		minutes (): Array<string> {
			const minutes = [];
			for (const [ index, _item ] of new Array(60).entries()) minutes.push(String(index).padStart(2, '0'));
			return minutes;
		},
		piInit (): boolean {
			return this.piStatusStore.init;
		},
		piOnline () :boolean {
			return this.piStatusStore.online;
		}
	},

	data: () => ({
		chosenHour: undefined as nu,
		chosenMinute: undefined as nu,
		dayOptions,
		daysSelected: [] as Array<number>,
		expandedAdd: false,
		loading: false,
		mdiAlarmPlus,
		mdiAlert,
		mdiClose,
		mdiPlus,
		messagesDays: undefined as su,
		messagesHour: undefined as su,
		messagesMinute: undefined as su,
	}),

	methods: {
		clearSelections (): void {
			this.chosenHour = undefined;
			this.chosenMinute = undefined;
			this.messagesHour = undefined;
			this.messagesMinute = undefined;
			this.messagesDays = undefined;
			this.daysSelected = [];
		},
		expandMethod (): void {
			this.expandedAdd = !this.expandedAdd;
			this.clearSelections();
			
		},
		addAlarm () : void {
			let alarmClash = false;
			if (!this.chosenHour) this.messagesHour = 'You need to select an hour';
			if (!this.chosenMinute) this.messagesMinute = 'You need to select an minute';
			if (this.daysSelected.length === 0) this.messagesDays = 'You need to select an day';
			if (!this.chosenHour || !this.chosenMinute || this.daysSelected.length === 0) return;

			const current = this.alarmsStore.get_alarms;
			if (current) {
				for (const day of this.daysSelected) {
					const a = current.findIndex((i) => i.day === day && i.hour === Number(this.chosenHour) && i.minute === Number(this.chosenMinute));
					if (a >= 0) alarmClash = true;
					break;
				}
			}
			if (alarmClash) {
				snackError({ message: 'An alarm is already set for that time & day', icon: mdiAlert });
				this.clearSelections();
			}
			else {
				const wsBody = { hour: Number(this.chosenHour), minute: Number(this.chosenMinute), days: this.daysSelected };
				this.websocketStore.send({ name: 'add_alarm', body: wsBody });
				this.expandMethod();
			}
		},
	},

	watch: {
		chosenHour (a): void {
			if (a) this.messagesHour = undefined;
		},
		chosenMinute (a): void {
			if (a) this.messagesMinute = undefined;
		},
		daysSelected (a): void {
			if (a) this.messagesDays = undefined;
		}
	}
});
</script>

<style scoped>
.days .v-label {
	font-size: .9rem!important;
}
</style>