<template>
	<v-expand-transition>
		<section v-if='alarms.length > 0'>
			<v-row fill-height justify='space-around' wrap>
				<v-col class='' cols='8' lg='4'>
					<v-fade-transition group tag='v-list'>
						<v-list-item
							v-for='(item, index) in alarms'
							:key='index'
							class='list-item'
							color='primary'
							density='compact'
							rounded
						>
							<v-row align='center' class='ma-1 pa-0' justify='space-between'>
								<v-col class='ma-0 pa-0' cols='auto'>
									<span class='clock-font'>{{ numToDay(item.day) }} - </span>
									<span class='clock-font'>{{ zeroPad(item.hour) }}</span>
									<span>:</span>
									<span class='clock-font'>{{ zeroPad(item.minute) }}</span>
								</v-col>
								<v-col class='ma-0 pa-0' cols='auto'>
									<v-icon
										:color
										:icon='mdiCloseCircle'
										size='small'
										style='vertical-align: middle;'
										@click='sender({ name: `delete_one`, body: { alarm_id: item.alarm_id } })'
									/>
								</v-col>
							</v-row>
						</v-list-item>
					</v-fade-transition>
				</v-col>
			</v-row>
			<v-row class='mt-2' justify='center' no-gutters>
				<v-col class='text-center mb-4'>
					<v-btn
						class='elevation-0'
						color='red'
						:disabled='!piOnline'
						rounded
						@click='sender({ name: "delete_all" })'
					>
						<v-icon
							class='mr-2'
							:color='computedColor'
							dark
							:icon='mdiDeleteSweep'
							style='vertical-align: middle;'
						/>
						<span :class='{ "text-white": piOnline }'>Delete All</span>
					</v-btn>
				</v-col>
			</v-row>
		</section>
	</v-expand-transition>
</template>

<script setup lang='ts'>
import type { TEmitBody } from '@/types'
import { mdiCloseCircle, mdiDeleteSweep } from '@mdi/js'
import { numToDay } from '@/services/dayOptions'
import { zeroPad } from '@/services/zeropad'

const [alarmStore, piStatusStore, wsStore] = [alarmModule(), piStatusModule(), wsModule()]

const alarms = computed(() => alarmStore.get_alarms)
const computedColor = computed(() => piOnline.value ? 'white' : '')
const color = computed(() => piOnline.value ? 'red' : 'grey')
const piOnline = computed(() => piStatusStore.online)

function sender (body: TEmitBody): void {
	if (!piOnline.value) return
	wsStore.send(body)
}
</script>

<style scoped>
.list-item:hover {
    background-color: rgba(225, 190, 231, .75);
}
</style>
