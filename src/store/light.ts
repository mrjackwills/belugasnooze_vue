import type { PiniaModuleName } from '@/types';
import { defineStore } from 'pinia';

const name: PiniaModuleName = 'light';

export const lightModule = defineStore(name, {

	state: () => ({ on: false }),

	actions: {
		set_on (value: boolean) {
			this.on = value;
		}
	}
});
