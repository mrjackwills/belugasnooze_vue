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
					<v-row class='justify-center ma-0 pa-0 my-2' density='compact'>
						<v-col class='text-center' cols='auto'>
							<span class='text-body-large'>Are you sure you want to restart the application?</span>
						</v-col>
					</v-row>
					<v-row class='justify-center ma-0 pa-0' density='compact'>
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
