<template>
	<section>
		<section v-for='(item, index) in uptimeNameAndValues' :key='index'>
			<v-row align='center' justify='center' no-gutters>
				<v-col cols='11' sm='8' class=' '>
					<v-row align='center' class='unselectable' justify='space-around' no-gutters>
						<v-col cols='5' class=' ma-0 pa-0'>
							<div class='text-overline font-weight-bold text-left' :class='computedColor'>
								<span :class='computedFontSize'>{{ item.name }}</span>
							</div>
						</v-col>
						<v-col cols='7' class='ma-0 pa-0'>
							<div class='text-body-1 text-right' :class='computedColor'>
								<span :class='computedFontSize' class='mono-numbers'>{{ item.value }}</span>
							</div>
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row v-if='index + 1 !== uptimeNameAndValues.length' align='center' justify='center' no-gutters
				class='ma-0 pa-0'>
				<v-col cols='11' sm='8' ckass='ma-0 pa-0'>
					<v-divider />
				</v-col>
			</v-row>

		</section>
	</section>
</template>

<script setup lang='ts'>
import type { TComputedUptime } from '@/types';
import { secondsToText } from '@/services/secondsToText';
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();

const piStatusStore = piStatusModule();

onBeforeMount(() => {
	if (mobile.value) visible.value = true;
});

const uptimeNameAndValues = computed((): Array<TComputedUptime> => [
	{
		name: 'app uptime',
		tooltip: uptimeToString(piStatusStore.piAppUptime),
		value: secondsToDays(piStatusStore.piAppUptime)
	},
	{
		name: 'pi uptime',
		tooltip: uptimeToString(piStatusStore.piUptime),
		value: secondsToDays(piStatusStore.piUptime)
	},
	{
		name: 'websocket',
		tooltip: uptimeToString(piStatusStore.connectedFor),
		value: secondsToDays(piStatusStore.connectedFor)
	},
	{
		name: 'client version',
		value: String(piStatusStore.piVersion)
	}
]);

const computedColor = computed(() => piOnline.value ? '' : 'serious--text');
const computedFontSize = computed(() => mobile.value ? 'small-text' : '');
const piOnline = computed(() => piStatusStore.online);

const visible = ref(false);

const uptimeToString = (time: number | undefined): string => {
	if (!time || isNaN(time)) return 'NULL';
	const now = Math.trunc(Date.now() / 1000);
	const t = (now - time) * 1000;
	return new Date(t).toString();
};

const secondsToDays = (s: number | undefined): string => {
	if (isNaN(Number(s))) return 'NULL';
	return secondsToText(Number(s), mobile.value);
};
</script>
