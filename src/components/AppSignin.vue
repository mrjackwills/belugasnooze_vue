<template>
	<section>
		<v-row align='center' class='ma-0 pa-0' justify='center'>
			<v-col class='ma-0 pa-0' cols='11' lg='6' md='8'>
				<v-card-text>
					<v-form method='post' @submit.prevent>
						<v-text-field
							id='password'
							v-model='password'
							:append-inner-icon='appendIcon'
							autocomplete='password'
							color='primary'
							:disabled='loading'
							label='Password'
							:prepend-inner-icon='mdiLock'
							:type='fieldType'
							variant='outlined'
							@click:append-inner='appendClick'
							@keydown.enter='signin'
						/>
					</v-form>
				</v-card-text>
			</v-col>
		</v-row>
		<v-row align='center' class='ma-0 pa-0' justify='center'>
			<v-col class='ma-0 pa-0' cols='auto'>
				<v-btn
					class='elevation-0 font-weight-bold'
					color='primary'
					:disabled='buttonDisabled'
					:variant='buttonDisabled ? "outlined" : "flat"'
					@click='signin'
				>
					<span :class='{ "text-white": !buttonDisabled }'>Sign In</span>
				</v-btn>
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import { mdiEye, mdiEyeOff, mdiLock } from '@mdi/js'
import { axiosRequests } from '@/services/axios'
import { snackReset } from '@/services/snack'

const loadingStore = loadingModule()

const password = ref('')
const passwordVisible = ref(false)

const appendIcon = computed(() => passwordVisible.value ? mdiEyeOff : mdiEye)
const buttonDisabled = computed(() => loading.value || !password.value)
const fieldType = computed(() => passwordVisible.value ? 'text' : 'password')

const loading = computed({
	get (): boolean {
		return loadingStore.loading
	},
	set (b: boolean) {
		loadingStore.set_loading(b)
	},
})

function appendClick (): void {
	if (loading.value) return
	passwordVisible.value = !passwordVisible.value
}

async function signin (): Promise<void> {
	if (!password.value) return
	passwordVisible.value = false
	loading.value = true
	const response = await axiosRequests.wsAuth_post(password.value)
	password.value = ''
	loading.value = false
	if (response) snackReset()
}

</script>
