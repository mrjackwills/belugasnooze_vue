<template>
	<section v-if='piTimeValid && piInit'>
		<v-row align='center' justify='center' class='mr-2'>
			<v-col cols='auto' class='pa-0'>
				<div>
					<span :class='[computedFontSize, computedTextColor]'
						class='text-white font-weight-medium clock-font'>{{ hourExtractor(piTime) }}</span>
					<span :class='[computedFontSize, computedTextColor]' class='text-white font-weight-medium'>:</span>
					<span :class='[computedFontSize, computedTextColor]'
						class='text-white font-weight-medium clock-font'>{{ minuteExtractor(piTime) }}</span>
					<span :class='[computedFontSize, computedTextColor]' class='text-white font-weight-medium'>:</span>
					<span :class='[computedFontSize, computedTextColor]'
						class='text-white font-weight-medium clock-font'>{{ secondExtractor(piTime) }}</span>
				</div>
			</v-col>

			<v-col cols='auto' class='pa-0 mx-2'>
				<v-icon :class='computedAnimation' :color='computedIconColor' :icon='computedIcon'
					:size='mobile ? `small` : `default`' class='mb-1' style='vertical-align: middle;' />
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import { mdiWifi, mdiWifiOff } from '@mdi/js';
import type { TTime } from '@/types';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const piStatusStore = piStatusModule();

const computedAnimation = computed(() => piOnline.value ? '' : 'pulse-animation');
const computedFontSize = computed(() => mobile.value ? 'text-subtitle-1' : 'text-h5');
const computedIcon = computed(() => piOnline.value ? mdiWifi : mdiWifiOff);
const computedIconColor = computed(() => piOnline.value ? 'white' : 'serious');
const computedTextColor = computed(() => piOnline.value ? 'text-white' : 'text-serious');
const piOnline = computed(() => piStatusStore.online);
const piInit = computed(() => piStatusStore.init);
const piTime = computed(() => piStatusStore.time);
const piTimeValid = computed(() => !isNaN(Number(piStatusStore.time.hours)));


const hourExtractor = (i: TTime): string => i ? `${String(i.hours).padStart(2, '0')}` : '';
const minuteExtractor = (i: TTime): string => i ? `${String(i.minutes).padStart(2, '0')}` : '';
const secondExtractor = (i: TTime): string => i ? `${String(i.seconds).padStart(2, '0')}` : '';
</script>
