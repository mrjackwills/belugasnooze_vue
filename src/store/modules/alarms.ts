import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';
import { TAllAlarms } from '@/types';

export const alarmModule = defineStore(ModuleName.Alarms, {

	state: () => ({
		alarms: [] as TAllAlarms
	}),

	getters: {
		get_alarms (): TAllAlarms {
			return this.alarms.sort((a, b) => a.day - b.day || a.hour - b.hour || a.minute - b.minute);
		}
	},

	actions: {
		set_alarms (a: TAllAlarms): void {
			this.alarms = a;
		},
	}
});
