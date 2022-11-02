<template>
	<v-row align='center' justify='center' class='' >
		<v-col cols='12'>
			<v-row align='center' justify='center'>
				<v-col cols='auto '>
					<v-btn
						@click='showSettings'
						:disabled='loading && piInit'
						class='elevation-0 '
						:outlined='expandedSettings'
						:color='buttonColor'
						size='large'
						rounded
					>
						<v-icon color='white' style='vertical-align: middle;' class='mr-1' :icon='buttonIcon' />
						<span class='text-white'> {{ buttonText }} </span>
					</v-btn>
				</v-col>
			</v-row>
		</v-col>
		<v-col cols='12'>
			<v-expand-transition>
				<section  v-if='expandedSettings'>
					<v-row justify='center'>

						<RefreshData @piStatus='piStatus' />
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

import { mdiClose, mdiCog } from '@mdi/js';
import SignOut from '@/components/Settings/SignOut.vue';
import RefreshData from '@/components/Settings/RefreshData.vue';
import TimeZone from '@/components/Settings/TimeZone.vue';
import PiInfo from '@/components/Settings/PiInfo.vue';
import PiRestart from '@/components/Settings/PiRestart.vue';

const [ loadingStore, piStatusStore, settingsStore, wsStore ] =[ loadingModule(), piStatusModule(), settingsModule(), wsModule() ];
		
const buttonColor = computed((): string => {
	return expandedSettings.value ? 'red': 'primary';
});
const buttonIcon = computed(() : string =>{
	return expandedSettings.value ? mdiClose: mdiCog;
});
const buttonText = computed((): string =>{
	return expandedSettings.value ? 'close settings' : 'Settings';
});
const expandedSettings = computed({
	get: function (): boolean {
		return settingsStore.expanded;
	},
	set: function (b: boolean): void {
		settingsStore.set_expanded(b);
	}
});
const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});
const piInit = computed((): boolean =>{
	return piStatusStore.init;
});

const expandedReset = ref(false);

const piStatus = (): void => {
	wsStore.send({ name: 'status' });
};
const showSettings = (): void => {
	if (loading.value) return;
	expandedSettings.value = !expandedSettings.value;
	expandedReset.value = false;
};
</script>