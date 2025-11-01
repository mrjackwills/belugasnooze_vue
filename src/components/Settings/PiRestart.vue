<template>
	<v-col class='' cols='12'>
		<div id='restartserver' class='text-center'>
			<v-btn
				class='elevation-0'
				:color='expandedReset ? "red" : "primary"'
				:disabled='localLoading || loading'
				rounded
				@click='expandedReset = !expandedReset'
			>
				<v-icon
					class='mr-1'
					color='white'
					:icon='computedRestartButton'
					small
					style='vertical-align: middle;'
				/>
				<span v-if='!expandedReset' class='text-white'>restart server</span>
				<span v-else class='text-white'>cancel</span>
			</v-btn>
		</div>
		<v-expand-transition>
			<div v-if='expandedReset' class=''>
				<section>
					<v-row class='' justify='center'>
						<v-col class='text-center' cols='auto'>
							<span :class='restartFont'>Are you sure you want to restart the pi and the server?</span>
						</v-col>
					</v-row>
					<v-row class='' justify='center'>
						<v-col class='' cols='auto'>
							<v-btn
								class='elevation-0 '
								color='serious'
								:disabled='localLoading'
								rounded
								size='small'
								@click='serverRestart'
							>
								<span class='text-white'>confirm restart</span>
							</v-btn>
						</v-col>
					</v-row>
				</section>
			</div>
		</v-expand-transition>
	</v-col>
</template>

<script setup lang='ts'>
import { mdiClose, mdiRestartAlert } from '@mdi/js'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const [loadingStore, userStore, wsStore] = [loadingModule(), userModule(), wsModule()]

onBeforeUnmount(() => {
	expandedReset.value = false
})

const computedRestartButton = computed(() => expandedReset.value ? mdiClose : mdiRestartAlert)

const loading = computed({
	get (): boolean {
		return loadingStore.loading
	},
	set (b: boolean): void {
		loadingStore.set_loading(b)
	},
})
const restartFont = computed(() => mobile.value ? 'text-caption' : 'text-h6')

const expandedReset = ref(false)
const localLoading = ref(false)

async function serverRestart (): Promise<void> {
	try {
		if (loading.value) return
		loading.value = true
		wsStore.send({ name: 'restart' })
		expandedReset.value = false
		wsStore.closeWS()
		window.setTimeout(() => {
			userStore.signout()
			loading.value = false
		}, 5000)
	} catch {
		userStore.signout()
		wsStore.closeWS()
		loading.value = false
	}
}
</script>
