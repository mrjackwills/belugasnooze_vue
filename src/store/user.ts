import type { PiniaModuleName } from '@/types';
import { defineStore } from 'pinia';
const name: PiniaModuleName = 'user';
export const userModule = defineStore(name, {

	state: () => ({ authenticated: false }),

	actions: {
		set_authenticated (value: boolean) {
			this.authenticated = value;
		},
		signout () {
			this.set_authenticated(false);
			alarmModule().$reset();
			piStatusModule().$reset();
			settingsModule().$reset();
		}
	}
});