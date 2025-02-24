import { defineStore } from 'pinia';
import type { PiniaModuleName, TAllAlarms } from '@/types';

const name: PiniaModuleName = 'alarms';

export const alarmModule = defineStore(name, {

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
