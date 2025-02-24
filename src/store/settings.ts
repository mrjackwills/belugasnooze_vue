import type { PiniaModuleName } from '@/types';
import { defineStore } from 'pinia';

const name: PiniaModuleName = 'settings';

export const settingsModule = defineStore(name, {

	state: () => ({ expanded: false }),

	actions: {
		set_expanded (value: boolean) {
			this.expanded = value;
		}
	}
});
