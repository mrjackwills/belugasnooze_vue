<template>
	<v-expand-transition>
		<section v-if='alarms.length > 0'>
			<v-row wrap justify='space-around' fill-height>
				<v-col cols='8' lg='4' class=''>
					<v-fade-transition group tag='v-list'>
						<v-list-item v-for='(item, index) in alarms' :key='index' color='primary' class='list-item'
							density='compact' rounded>
							<v-row class='ma-1 pa-0' align='center' justify='space-between'>
								<v-col cols='auto' class='ma-0 pa-0'>
									<span class='clock-font'>{{ numToDay(item.day) }} - </span>
									<span class='clock-font'>{{ zeroPad(item.hour) }}</span>
									<span>:</span>
									<span class='clock-font'>{{ zeroPad(item.minute) }}</span>
								</v-col>
								<v-col cols='auto' class='ma-0 pa-0'>
									<v-icon @click='sender({ name: `delete_one`, body: { alarm_id: item.alarm_id } })'
										size='small' :color='color' style='vertical-align: middle;'
										:icon='mdiCloseCircle' />
								</v-col>
							</v-row>
						</v-list-item>
					</v-fade-transition>
				</v-col>
			</v-row>
			<v-row justify='center' class='mt-2' no-gutters>
				<v-col class='text-center mb-4'>
					<v-btn color='red' @click='sender({ name: "delete_all" })' :disabled='!piOnline' class='elevation-0'
						rounded>
						<v-icon style='vertical-align: middle;' :color='computedColor' class='mr-2' dark
							:icon='mdiDeleteSweep' />
						<span :class='{ "text-white": piOnline }'>Delete All</span>
					</v-btn>
				</v-col>
			</v-row>
		</section>
	</v-expand-transition>
</template>

<script setup lang='ts'>
import { mdiCloseCircle, mdiDeleteSweep } from '@mdi/js';
import { numToDay } from '@/services/dayOptions';
import { zeroPad } from '@/services/zeropad';
import type { TEmitBody } from '@/types';

const [alarmStore, piStatusStore, wsStore] = [alarmModule(), piStatusModule(), wsModule()];

const alarms = computed(() => alarmStore.get_alarms);
const computedColor = computed(() => piOnline.value ? 'white' : '');
const color = computed(() => piOnline.value ? 'red' : 'grey');
const piOnline = computed(() => piStatusStore.online);

const sender = (body: TEmitBody): void => {
	if (!piOnline.value) return;
	wsStore.send(body);
};
</script>

<style scoped>
.list-item:hover {
	background-color: rgba(225, 190, 231, .75);
}
</style>
