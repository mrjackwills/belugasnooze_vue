import { ModuleName } from '@/types/const_module';
import { defineStore } from 'pinia';

export const settingsModule = defineStore(ModuleName.Settings, {

	state: () => ({ expanded: false }),

	actions: {
		set_expanded (value: boolean) {
			this.expanded = value;
		}
	}
});
