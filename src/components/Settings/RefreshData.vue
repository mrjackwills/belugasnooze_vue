<template>
	<v-col class='' cols='12'>
		<v-row align='center' class='' justify='center'>
			<v-col class='' cols='auto'>
				<v-btn
					class='fab-fix elevation-0'
					color='success'
					:dark='!loading'
					:disabled='loading'
					min-width='30vw'
					rounded
					:size='mobile ? `small` : `default`'
					@click='piStatus'
				>
					<v-icon class='mr-1' :icon='mdiRefresh' small style='vertical-align: middle;' />
					refresh data
				</v-btn>
			</v-col>
		</v-row>
	</v-col>
</template>

<script setup lang='ts'>
import { mdiRefresh } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const emit = defineEmits(['pi-status'])

const loading = computed({
	get (): boolean {
		return loadingModule().loading
	},
	set (b: boolean): void {
		loadingModule().set_loading(b)
	},
})

function piStatus (): void {
	emit('pi-status')
}
</script>
