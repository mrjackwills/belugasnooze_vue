import { ModuleName } from '@/types/const_module';
import { defineStore } from 'pinia';

export const loadingModule = defineStore(ModuleName.Loading, {

	state: () => ({ loading: false }),

	actions: {
		set_loading (value: boolean) {
			this.loading = value;
		}
	}
});
