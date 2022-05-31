import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';

export const settingsModule = defineStore(ModuleName.Settings, {

	state: () => ({
		expanded: false,
	}),

	actions: {
		set_expanded (value: boolean) {
			this.expanded = value;
		},
	}
});
