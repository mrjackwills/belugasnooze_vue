<template>
	<v-col cols='12' class=''>
		<v-row align='center' justify='center' class=''>
			<v-col cols='auto' class=''>
				<v-btn @click='piStatus' :dark='!loading' :disabled='loading' :size='mobile ? `small` : `default`'
					class='fab-fix elevation-0' color='success' min-width='30vw' rounded>
					<v-icon style='vertical-align: middle;' class='mr-1' small :icon='mdiRefresh' />
					refresh data
				</v-btn>
			</v-col>
		</v-row>
	</v-col>
</template>

<script setup lang='ts'>
import { mdiRefresh } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
const emit = defineEmits(['piStatus']);

const loading = computed({
	get (): boolean {
		return loadingModule().loading;
	},
	set (b: boolean): void {
		loadingModule().set_loading(b);
	}
});

const piStatus = (): void => {
	emit('piStatus');
};
</script>