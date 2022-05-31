<template>
	<section>
		<v-row class='ma-0 pa-0' align='center' justify='center'>
			<v-col cols='11' md='8' lg='4' class='ma-0 pa-0'>
				<v-card-text>
					<v-form
						v-on:submit.prevent
						method='post'
					>
						<v-text-field
							v-model='password'
							@keydown.enter='signin'
							@click:append='appendClick'
							:append-icon='appendIcon'
							:disabled='loading'
							:prepend-icon='mdiLock'
							:type='fieldType'
							autocomplete='password'
							id='password'
							label='Password'
						/>
					</v-form>
				</v-card-text>
			</v-col>
		</v-row>
		<v-row class='ma-0 pa-0' align='center' justify='center'>
			<v-col cols='auto' class='ma-0 pa-0'>
				<v-btn
					@click='signin'
					:disabled='loading|| !password'
					class='elevation-0'
					color='primary'
				>
					Sign In
				</v-btn>
			</v-col>
		</v-row>
	</section>
</template>

<script lang='ts'>
import Vue from 'vue';

import { axiosRequests } from '@/services/axios';
import { loadingModule } from '@/store';
import { mapStores } from 'pinia';
import { mdiEye, mdiEyeOff, mdiLock } from '@mdi/js';
import { snackReset } from '@/services/snack';

export default Vue.extend({
	name: 'signin-component',

	computed: {
		...mapStores(loadingModule),

		appendIcon (): string {
			return this.password ? this.passwordVisible ? mdiEyeOff: mdiEye : '';
		},
		fieldType (): string {
			return this.passwordVisible ? 'text' : 'password';
		},
		loading: {
			get: function (): boolean {
				return this.loadingStore.loading;
			},
			set: function (b: boolean): void {
				this.loadingStore.set_loading(b);
			}
		},
	},

	data: () => ({
		mdiLock,
		password: '',
		passwordVisible: false,
	}),

	methods: {
		appendClick (): void {
			if (this.loading) return;
			this.passwordVisible = !this.passwordVisible;
		},

		async signin (): Promise<void> {
			if (!this.password) return;
			this.passwordVisible = false;
			this.loading = true;
			const response = await axiosRequests.wsAuth_post(this.password);
			this.password = '';
			this.loading = false;
			if (response) snackReset();
		}
	}
});

</script>