<template>
	<v-col cols='12' class=''>
		<div class='text-center' id='restartserver'>
			<v-btn
				@click='expandedReset = !expandedReset'
				:color='expandedReset? "red" : "primary"'
				:disabled='localLoading || loading'
				class='elevation-0'
				ref='resetButton'
				rounded
			>
				<v-icon color='white' small style='vertical-align: middle;' class='mr-1' :icon='computedRestartButton' />
				<span class='text-white' v-if='!expandedReset'>restart server</span>
				<span class='text-white' v-else>cancel</span>
			</v-btn>
		</div>
		<v-expand-transition>
			<div v-if='expandedReset' class=''>
				<section>
					<v-row justify='center' class=''>
						<v-col cols='auto' class='text-center'>
							<span :class='restartFont'>Are you sure you want to restart the pi and the server?</span>
						</v-col>
					</v-row>
					<v-row justify='center' class=''>
						<v-col cols='auto' class=''>
							<v-btn
								@click='serverRestart'
								:disabled='localLoading'
								class='elevation-0 '
								color='serious'
								rounded
								small
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
import { mdiClose, mdiRestartAlert } from '@mdi/js';
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();

const [ loadingStore, userStore, wsStore ] = [ loadingModule(), userModule(), wsModule() ];

onBeforeUnmount(() => {
	expandedReset.value = false;
});

const computedRestartButton = computed((): string => {
	return expandedReset ? mdiClose : mdiRestartAlert;
});

const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});
const restartFont = computed((): string => {
	return mobile ? 'text-caption' : 'text-h6';
});

const expandedReset = ref(false);
const localLoading = ref(false);

const serverRestart = async (): Promise<void> => {
	try {
		if (loading.value) return;
		loading.value = true;
		wsStore.send({ name: 'restart' });
		// $vuetify.goTo(0);
		expandedReset.value = false;
		wsStore.closeWS();
		window.setTimeout(() => {
			userStore.signout();
			loading.value = false;
		}, 5000);
	} catch (e) {
		userStore.signout();
		wsStore.closeWS();
		loading.value = false;
	}
};
</script>