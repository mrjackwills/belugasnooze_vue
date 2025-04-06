import type { PiniaModuleName } from '@/types';
import { defineStore } from 'pinia';

const name: PiniaModuleName = 'pageTitle';

export const pagetitleModule = defineStore(name, {
	state: () => ({ title: '' }),

	actions: {
		set_title (value: string) {
			this.title = value;
		}
	}
});
