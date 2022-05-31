<template>
	<v-card-text class=''>
		<v-row justify='center' class=' text-center'>
			<v-col cols='6' md='4' class='pt-0'>
				<v-row justify='center' align='center' class='no-gutters'>
					<v-col cols='auto' class='pt-0'>
						<v-btn
							@click='lightSwitch'
							:class='{"pulse-animation": lightOn}'
							:color='buttonColor'
							:disabled='!piOnline '
							class='elevation-0 fab-fix'
							fab
							medium
						>
							<v-icon
								:color='iconColor'
								style='vertical-align: middle;'
								medium
							>
								{{ icon }}
							</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-card-text>
</template>

<script lang='ts'>
import Vue from 'vue';

import { lightModule, piStatusModule, wsModule } from '@/store';
import { mapStores } from 'pinia';
import { mdiLightbulbOn, mdiLightbulbOff } from '@mdi/js';

export default Vue.extend({
	name: 'light-controls-component',

	computed: {
		...mapStores(lightModule, piStatusModule, wsModule),
		buttonColor (): string {
			return this.lightOn ? '#f9ce48' : '#000000';
		},
		icon (): string {
			return this.lightOn ? mdiLightbulbOn : mdiLightbulbOff ;
		},
		iconColor (): string {
			return this.lightOn ? 'black' : 'white';
		},
		lightOn (): boolean {
			return this.lightStore.on;
		},
		piInit (): boolean {
			return this.piStatusStore.init;
		},
		piOnline (): boolean {
			return this.piStatusStore.online;
		},
	},
	
	methods: {
		lightSwitch (): void {
			// const name = this.lightOn ? 'lightoff' : 'lighton';
			this.websocketStore.send({ name: 'light', body: { status: !this.lightOn } });
		}
	},
});
</script>