<template>
	<section>
		<v-row class='ma-0 pa-0' align='center' justify='center'>
			<v-col cols='11' md='8' lg='6' class='ma-0 pa-0'>
				<v-card-text>
					<v-form v-on:submit.prevent method='post'>
						<v-text-field v-model='password' @keydown.enter='signin' @click:append-inner='appendClick'
							:append-inner-icon='appendIcon' :disabled='loading' :prepend-inner-icon='mdiLock'
							:type='fieldType' autocomplete='password' color='primary' variant='outlined' id='password'
							label='Password' />
					</v-form>
				</v-card-text>
			</v-col>
		</v-row>
		<v-row class='ma-0 pa-0' align='center' justify='center'>
			<v-col cols='auto' class='ma-0 pa-0'>
				<v-btn @click='signin' :disabled='buttonDisabled' :variant='buttonDisabled ? "outlined" : "flat"'
					class='elevation-0 font-weight-bold' color='primary'>
					<span :class='{ "text-white": !buttonDisabled }'>Sign In</span>
				</v-btn>
			</v-col>
		</v-row>
	</section>
</template>

<script setup lang='ts'>
import { axiosRequests } from '@/services/axios';
import { mdiEye, mdiEyeOff, mdiLock } from '@mdi/js';
import { snackReset } from '@/services/snack';

const loadingStore = loadingModule();

const password = ref('');
const passwordVisible = ref(false);

const appendIcon = computed(() => passwordVisible.value ? mdiEyeOff : mdiEye);
const buttonDisabled = computed(() => loading.value || !password.value);
const fieldType = computed(() => passwordVisible.value ? 'text' : 'password');

const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean) {
		loadingStore.set_loading(b);
	}
});

const appendClick = (): void => {
	if (loading.value) return;
	passwordVisible.value = !passwordVisible.value;
};

const signin = async (): Promise<void> => {
	if (!password.value) return;
	passwordVisible.value = false;
	loading.value = true;
	const response = await axiosRequests.wsAuth_post(password.value);
	password.value = '';
	loading.value = false;
	if (response) snackReset();
};

</script>
