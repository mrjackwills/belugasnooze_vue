<template>
	<v-row align='center' class='' justify='center'>
		<v-col cols='12'>
			<v-row align='center' justify='center'>
				<v-col cols='auto '>
					<v-btn
						class='elevation-0 '
						:color='buttonColor'
						:disabled='loading && piInit'
						:outlined='expandedSettings'
						rounded
						size='large'
						@click='showSettings'
					>
						<v-icon class='mr-1' color='white' :icon='buttonIcon' style='vertical-align: middle;' />
						<span class='text-white'> {{ buttonText }} </span>
					</v-btn>
				</v-col>
			</v-row>
		</v-col>
		<v-col cols='12'>
			<v-expand-transition>
				<section v-if='expandedSettings'>
					<v-row justify='center'>

						<RefreshData @pi-status='send_pi_status' />
						<TimeZone />

						<PiInfo />

						<PiRestart />
					</v-row>
					<SignOut />
				</section>
			</v-expand-transition>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>

import { mdiClose, mdiCog } from '@mdi/js'

const [loadingStore, piStatusStore, settingsStore, wsStore] = [loadingModule(), piStatusModule(), settingsModule(), wsModule()]

const buttonColor = computed(() => expandedSettings.value ? 'red' : 'primary')
const buttonIcon = computed(() => expandedSettings.value ? mdiClose : mdiCog)
const buttonText = computed(() => expandedSettings.value ? 'close settings' : 'Settings')

const expandedSettings = computed({
	get (): boolean {
		return settingsStore.expanded
	},
	set (b: boolean): void {
		settingsStore.set_expanded(b)
	},
})
const loading = computed({
	get (): boolean {
		return loadingStore.loading
	},
	set (b: boolean): void {
		loadingStore.set_loading(b)
	},
})
const piInit = computed(() => piStatusStore.init)

const expandedReset = ref(false)

function send_pi_status (): void {
	wsStore.send({ name: 'status' })
}
function showSettings (): void {
	if (loading.value) return
	expandedSettings.value = !expandedSettings.value
	expandedReset.value = false
}
</script>
