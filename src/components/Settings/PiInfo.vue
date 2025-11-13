<template>
	<v-col class='' cols='12'>
		<v-row v-if='mobile' align='center' class='no-gutters' justify='center'>
			<v-col class='pa-0' cols='auto'>
				<v-btn
					class='fab-fix elevation-0'
					:color='infoColor'
					:dark='!loading'
					:disabled='loading'
					min-width='30vw'
					rounded
					:size='mobile ? `small` : `default`'
					@click='visible = !visible'
				>
					<v-icon class='mr-1' :icon='mdiIpNetwork' size='small' style='vertical-align: middle;' />
					info
					<v-icon class='ml-1' :icon='computedInfoIcon' size='small' style='vertical-align: middle;' />
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
import { mdiChevronDown, mdiChevronUp, mdiIpNetwork } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mdAndUp, mobile } = useDisplay()

const [loadingStore, piStatusStore] = [loadingModule(), piStatusModule()]

onBeforeMount(() => {
	visible.value = mdAndUp.value
})

const computedInfoIcon = computed(() => visible.value ? mdiChevronUp : mdiChevronDown)
const infoColor = computed(() => visible.value ? 'danger' : 'black')
const piOnline = computed(() => piStatusStore.online)
const loading = computed({
	get (): boolean {
		return loadingStore.loading
	},
	set (b: boolean): void {
		loadingStore.set_loading(b)
	},
})

const visible = ref(false)

</script>
