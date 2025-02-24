import type { PiniaModuleName } from '@/types';
import { defineStore } from 'pinia';

const name: PiniaModuleName = 'loading';

export const loadingModule = defineStore(name, {

	state: () => ({ loading: false }),

	actions: {
		set_loading (value: boolean) {
			this.loading = value;
		}
	}
});
