<template>
	<v-expand-transition>
		<section v-if='alarms.length >0'>
			<v-row wrap justify='space-around' fill-height>
				<v-col cols='8' lg='4' class=''>
					<v-fade-transition group tag='v-list' >
						<v-list-item
							v-for='(item, index) in alarms'
							:key='index'
							class='list-item'
							dense
						>
							<v-list-item-content class='py-0 '>
								<div>
									<span class='alarm-list-font'>{{ item.day | numToDay }} - </span>
									<span class='alarm-list-font'>{{ item.hour | zeroPad }}</span>
									<span>:</span>
									<span class='alarm-list-font'>{{ item.minute | zeroPad }}</span>
								</div>
							</v-list-item-content>
							<v-btn
								@click='sender({name: `delete_one`, body: {alarm_id: item.alarm_id}})'
								:disabled='!piOnline'
								class='fab-fix'
								color='red'
								fab
								small
								text
							>
								<v-icon style='vertical-align: middle;' color='red'>{{ mdiCloseCircle }}</v-icon>
							</v-btn>
						</v-list-item>
					</v-fade-transition>
				</v-col>
			</v-row>
			<v-row justify='center' class='' no-gutters>
				<v-col class='text-center mb-4'>
					<v-btn color='red'
						@click='sender({name: "delete_all"})'
						:disabled='!piOnline'
						class='elevation-0'
						rounded
					>
						<v-icon style='vertical-align: middle;' :color='computedColor' class='mr-2' dark>{{ mdiDeleteSweep }}</v-icon>
						<span :class='{"white--text":piOnline}'>Delete All</span>
					</v-btn>
				</v-col>
			</v-row>
		</section>
	</v-expand-transition>
</template>

<script lang='ts'>
import Vue from 'vue';

import { alarmModule, piStatusModule, wsModule } from '@/store';
import { mapStores } from 'pinia';
import { mdiCloseCircle, mdiDeleteSweep } from '@mdi/js';
import { numToDay } from '@/vanillaTS/dayOptions';
import { zeroPad } from '@/vanillaTS/zeropad';
import { TAllAlarms, TEmitBody } from '@/types';

export default Vue.extend({
	name: 'alarms-list-components',

	computed: {
		...mapStores(alarmModule, piStatusModule, wsModule),

		alarms (): TAllAlarms {
			return this.alarmsStore.get_alarms;
		},
		computedColor (): string {
			return this.piOnline ? 'white': '';
		},
		piOnline (): boolean {
			return this.piStatusStore.online;
		},
	},
	data: () => ({
		mdiCloseCircle,
		mdiDeleteSweep,
	}),

	filters: {
		numToDay (num: number): string {
			return numToDay(num);
		},
		zeroPad (num: number): string {
			return zeroPad(num);
		}
	},

	methods: {
		sender (body: TEmitBody): void {
			this.websocketStore.send(body);
		}
	}
});
</script>

<style scoped>
.list-item:hover {
	background-color: rgba(225, 190, 231, .25);
}
</style>