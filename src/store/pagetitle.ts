import { ModuleName } from '@/types/const_module';
import { defineStore } from 'pinia';

export const pagetitleModule = defineStore(ModuleName.PageTitle, {
	state: () => ({ title: '' }),

	actions: {
		set_title (value: string) {
			this.title = value;
		}
	}
});
