<template>
	<v-card-text class=''>
		<v-row justify='center' class=' text-center'>
			<v-col cols='6' md='4' class='pt-0'>
				<v-row justify='center' align='center' class='no-gutters'>
					<v-col cols='auto' class='pt-0'>
						<v-btn @click='lightSwitch' :class='{ "pulse-animation": lightOn }' :color='buttonColor'
							:disabled='!piOnline' class='elevation-0' icon>
							<v-icon :color='iconColor' :icon style='vertical-align: middle;' />
						</v-btn>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-card-text>
</template>

<script setup lang='ts'>

import { mdiLightbulbOn, mdiLightbulbOff } from '@mdi/js';
const [lightStore, piStatusStore, wsStore] = [lightModule(), piStatusModule(), wsModule()];

const buttonColor = computed(() => piOnline.value ? lightOn.value ? '#f9ce48' : '#000000' : '');
const icon = computed(() => lightOn.value ? mdiLightbulbOn : mdiLightbulbOff);
const iconColor = computed(() => lightOn.value ? 'black' : 'white');
const lightOn = computed(() => lightStore.on);
const piOnline = computed(() => piStatusStore.online);
const lightSwitch = (): void => {
	wsStore.send({
		name: 'light',
		body: { status: !lightOn.value }
	});
};
</script>
