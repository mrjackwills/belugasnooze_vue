<template>
	<section v-if='piTimeValid && piInit' >
		<v-row align='center' justify='center' class='mr-2'>
			<v-col cols='auto' class='pa-0'>
				<div  >
					<span :class='[computedFontSize, computedTextColor]' class='text-white font-weight-medium clock-font'>{{ hourExtractor(piTime) }}</span>
					<span :class='[computedFontSize, computedTextColor]' class='text-white font-weight-medium'>:</span>
					<span :class='[computedFontSize, computedTextColor]' class='text-white font-weight-medium clock-font'>{{ minuteExtractor(piTime) }}</span>
					<span :class='[computedFontSize, computedTextColor]' class='text-white font-weight-medium'>:</span>
					<span :class='[computedFontSize, computedTextColor]' class='text-white font-weight-medium clock-font'>{{ secondExtractor(piTime) }}</span>
				</div>
			</v-col>

			<v-col cols='auto' class='pa-0 mx-2'>
				<v-icon
					:class='computedAnimation'
					:color='computedIconColor'
					:icon='computedIcon'
					:size='breakpoint.xs.value ? `small`:`default`'
					class='mb-1'
					style='vertical-align: middle;'

				/>
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import { mdiWifi, mdiWifiOff } from '@mdi/js';
import type { TTime } from '@/types';
import { useDisplay } from 'vuetify';

const piStatusStore = piStatusModule();
const breakpoint = useDisplay();

const computedAnimation = computed(() => {
	return piOnline.value ? '' : 'pulse-animation';
});
const computedFontSize = computed(() => {
	return breakpoint.xs.value ? 'text-subtitle-2' : 'text-h5';
});
const computedIcon = computed(() => {
	return piOnline.value ? mdiWifi : mdiWifiOff;
});
const computedIconColor = computed(() => {
	return piOnline.value ? 'white' : 'serious';
});
const computedTextColor = computed(() => {
	return piOnline.value ? 'text-white' : 'serious--text';
});

const piOnline = computed(() => {
	return piStatusStore.online;
});
const piInit = computed(() => {
	return piStatusStore.init;
});
const piTime = computed(() => {
	return piStatusStore.time;
});
const piTimeValid = computed(() => {
	return !isNaN(Number(piStatusStore.time.hours));
});

const hourExtractor = (i: TTime): string => {
	return i ? `${String(i.hours).padStart(2, '0')}` : '';
};
const minuteExtractor = (i: TTime): string => {
	return i ? `${String(i.minutes).padStart(2, '0')}` : '';
};
const secondExtractor = (i: TTime): string => {
	return i ? `${String(i.seconds).padStart(2, '0')}` : '';
};
</script>
