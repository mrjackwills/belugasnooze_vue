<template>
	<section>
		<section v-for='(item, index) in uptimeNameAndValues' :key='index'>
			<v-row align='center' justify='center' no-gutters>
				<v-col class=' ' cols='11' sm='8'>
					<v-row align='center' class='unselectable' justify='space-around' no-gutters>
						<v-col class=' ma-0 pa-0' cols='5'>
							<div class='text-overline font-weight-bold text-left' :class='computedColor'>
								<span :class='computedFontSize'>{{ item.name }}</span>
							</div>
						</v-col>
						<v-col class='ma-0 pa-0' cols='7'>
							<div class='text-body-1 text-right' :class='computedColor'>
								<span class='mono-numbers' :class='computedFontSize'>{{ item.value }}</span>
							</div>
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row
				v-if='index + 1 !== uptimeNameAndValues.length'
				align='center'
				class='ma-0 pa-0'
				justify='center'
				no-gutters
			>
				<v-col ckass='ma-0 pa-0' cols='11' sm='8'>
					<v-divider />
				</v-col>
			</v-row>

		</section>
	</section>
</template>

<script setup lang='ts'>
import type { TComputedUptime } from '@/types'
import { useDisplay } from 'vuetify'
import { secondsToText } from '@/services/secondsToText'
const { mobile } = useDisplay()

const piStatusStore = piStatusModule()

onBeforeMount(() => {
	if (mobile.value) visible.value = true
})

const uptimeNameAndValues = computed((): Array<TComputedUptime> => [
	{
		name: 'app uptime',
		tooltip: uptimeToString(piStatusStore.piAppUptime),
		value: secondsToDays(piStatusStore.piAppUptime),
	},
	{
		name: 'pi uptime',
		tooltip: uptimeToString(piStatusStore.piUptime),
		value: secondsToDays(piStatusStore.piUptime),
	},
	{
		name: 'websocket',
		tooltip: uptimeToString(piStatusStore.connectedFor),
		value: secondsToDays(piStatusStore.connectedFor),
	},
	{
		name: 'client version',
		value: String(piStatusStore.piVersion),
	},
])

const computedColor = computed(() => piOnline.value ? '' : 'serious--text')
const computedFontSize = computed(() => mobile.value ? 'small-text' : '')
const piOnline = computed(() => piStatusStore.online)

const visible = ref(false)

function uptimeToString (time: number | undefined): string {
	if (!time || Number.isNaN(time)) return 'NULL'
	const now = Math.trunc(Date.now() / 1000)
	const t = (now - time) * 1000
	return new Date(t).toString()
}

function secondsToDays (s: number | undefined): string {
	if (Number.isNaN(s)) return 'NULL'
	return secondsToText(Number(s), mobile.value)
}
</script>
