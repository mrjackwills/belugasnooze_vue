<template>
	<v-card-text class=''>
		<v-row class=' text-center' justify='center'>
			<v-col class='pt-0' cols='6' md='4'>
				<v-row align='center' class='no-gutters' justify='center'>
					<v-col class='pt-0' cols='auto'>
						<v-btn
							class='elevation-0'
							:class='{ "pulse-animation": lightOn }'
							:color='buttonColor'
							:disabled='!piOnline'
							icon
							@click='lightSwitch'
						>
							<v-icon :color='iconColor' :icon style='vertical-align: middle;' />
						</v-btn>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-card-text>
</template>

<script setup lang='ts'>

import { mdiLightbulbOff, mdiLightbulbOn } from '@mdi/js'
const [lightStore, piStatusStore, wsStore] = [lightModule(), piStatusModule(), wsModule()]

const buttonColor = computed(() => piOnline.value ? (lightOn.value ? '#f9ce48' : '#000000') : '')
const icon = computed(() => lightOn.value ? mdiLightbulbOn : mdiLightbulbOff)
const iconColor = computed(() => lightOn.value ? 'black' : 'white')
const lightOn = computed(() => lightStore.on)
const piOnline = computed(() => piStatusStore.online)
function lightSwitch (): void {
	wsStore.send({
		name: 'light',
		body: { status: !lightOn.value },
	})
}
</script>
