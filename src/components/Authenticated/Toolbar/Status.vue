<template>
	<section v-if='piTimeValid && piInit'>
		<v-row align='center' justify='center' >
			<v-col cols='auto' class='pa-0'>
				<div  >
					<span :class='[computedFontSize, computedTextColor]' class='font-weight-medium clock-font'>{{ piTime | hourExtractor }}</span>
					<span :class='[computedFontSize, computedTextColor]' class='font-weight-medium'>:</span>
					<span :class='[computedFontSize, computedTextColor]' class='font-weight-medium clock-font'>{{ piTime | minuteExtractor }}</span>
					<span :class='[computedFontSize, computedTextColor]' class='font-weight-medium'>:</span>
					<span :class='[computedFontSize, computedTextColor]' class='font-weight-medium clock-font'>{{ piTime | secondExtractor }}</span>
				</div>
			</v-col>

			<v-col cols='auto' class='pa-0 mx-2'>
				<v-icon style='vertical-align: middle;'
					:class='computedAnimation'
					:color='computedIconColor'
					:small='$vuetify.breakpoint.xsOnly'
					class='mb-1'
				>
					{{ computedIcon }}
				</v-icon>
			</v-col>
		</v-row>
	</section>
</template>

<script lang='ts'>
import Vue from 'vue';

import { loadingModule, piStatusModule } from '@/store';
import { mapStores } from 'pinia';
import { mdiWifi, mdiWifiOff } from '@mdi/js';
import { TTime } from '@/types';

export default Vue.extend({
	name: 'toolbar-status-component',

	computed: {
		...mapStores(loadingModule, piStatusModule),
		
		computedAnimation (): string {
			return this.piOnline ? '' : 'pulse-animation';
		},
		computedFontSize (): string {
			return this.$vuetify.breakpoint.xsOnly? 'text-subtitle-2' : 'text-h5';
		},
		computedIcon (): string {
			return this.piOnline ? mdiWifi: mdiWifiOff;
		},
		computedIconColor (): string {
			return this.piOnline ? 'white': 'serious';
		},
		computedTextColor (): string {
			return this.piOnline ? 'white--text': 'serious--text';
		},
		loading (): boolean {
			return this.loadingStore.loading;
		},
		piOnline (): boolean {
			return this.piStatusStore.online;
		},
		piInit (): boolean {
			return this.piStatusStore.init;
		},
		piTime (): TTime {
			return this.piStatusStore.time;
		},
		piTimeValid () : boolean {
			return !isNaN(Number(this.piStatusStore.time.hours));
		},
	},

	filters: {
		hourExtractor (i: TTime): string {
			return i ? `${String(i.hours).padStart(2, '0')}` : '';
		},
		minuteExtractor (i: TTime): string {
			return i ? `${String(i.minutes).padStart(2, '0')}`: '';
		},
		secondExtractor (i: TTime): string {
			return i ? `${String(i.seconds).padStart(2, '0')}` : '';
		},
		timeExtractor (i: TTime): string {
			return i ? `String(i.hours).padStart(2, '0')}:${String(i.minutes).padStart(2, '0')}:${String(i.seconds).padStart(2, '0')}`: '';
		},
	},
});
</script>
