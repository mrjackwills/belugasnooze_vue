<template>
	<v-col cols='12' class=''>
		<v-row v-if='mobile' align='center' class='no-gutters' justify='center'>
			<v-col cols='auto' class='pa-0'>
				<v-btn @click='visible = !visible' :color='infoColor' :dark='!loading' :disabled='loading'
					:size='mobile ? `small` : `default`' class='fab-fix elevation-0' min-width='30vw' rounded>
					<v-icon style='vertical-align: middle;' class='mr-1' size='small' :icon='mdiIpNetwork' />
					info
					<v-icon style='vertical-align: middle;' class='ml-1' size='small' :icon='computedInfoIcon' />
				</v-btn>
			</v-col>
		</v-row>
		<v-expand-transition>
			<section v-if='visible'>
				<PiIp />

				<v-expand-transition>
					<PiUptime v-if='piOnline' />
				</v-expand-transition>

			</section>
		</v-expand-transition>
	</v-col>
</template>

<script setup lang='ts'>
import { mdiChevronDown, mdiChevronUp, mdiIpNetwork } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mdAndUp, mobile } = useDisplay();

const [loadingStore, piStatusStore] = [loadingModule(), piStatusModule()];

onBeforeMount(() => {
	visible.value = mdAndUp.value;
});

const computedInfoIcon = computed(() => visible.value ? mdiChevronUp : mdiChevronDown);
const infoColor = computed(() => visible.value ? 'danger' : 'black');
const piOnline = computed(() => piStatusStore.online);
const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});

const visible = ref(false);

</script>