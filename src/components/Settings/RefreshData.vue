<template>
	<v-col cols='12' class=''>
		<v-row align='center' justify='center' class=''>
			<v-col cols='auto' class=''>
				<v-btn
					@click='piStatus'
					color='success'
					:disabled='loading'
					:dark='!loading'
					:size='mobile ? `small`:`default`'
					class='fab-fix elevation-0'
					rounded
					min-width='30vw'
				>
					<v-icon style='vertical-align: middle;' class='mr-1' small :icon='mdiRefresh' />
					refresh data
				</v-btn>
			</v-col>
		</v-row>
	</v-col>
</template>

<script setup lang='ts'>
import { mdiRefresh, } from '@mdi/js';
import { useDisplay } from 'vuetify';

const loadingStore = loadingModule();
const { mobile } = useDisplay();
const emit = defineEmits([ 'piStatus' ]);

const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});

const piStatus = (): void => {
	emit('piStatus');
};
</script>