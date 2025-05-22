import { defineStore } from 'pinia';
import type { TAllAlarms } from '@/types';
import { ModuleName } from '@/types/const_module';

export const alarmModule = defineStore(ModuleName.Alarms, {

	state: () => ({ alarms: [] as TAllAlarms }),

	getters: {
		get_alarms (): TAllAlarms {
			return this.alarms.sort((a, b) => a.day - b.day || a.hour - b.hour || a.minute - b.minute);
		}
	},

	actions: {
		set_alarms (a: TAllAlarms): void {
			this.alarms = a;
		}
	}
});
