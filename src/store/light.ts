import { ModuleName } from '@/types/const_module';
import { defineStore } from 'pinia';

export const lightModule = defineStore(ModuleName.Light, {

	state: () => ({ on: false }),

	actions: {
		set_on (value: boolean) {
			this.on = value;
		}
	}
});
