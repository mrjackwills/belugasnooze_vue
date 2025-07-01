import { ModuleName } from '@/types/const_module';
import { defineStore } from 'pinia';

export const userModule = defineStore(ModuleName.User, {

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
