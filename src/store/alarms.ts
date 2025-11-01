import type { TAllAlarms } from '@/types'
import { defineStore } from 'pinia'
import { ModuleName } from '@/types'

export const alarmModule = defineStore(ModuleName.Alarms, {

	state: () => ({ alarms: [] as TAllAlarms }),

	getters: {
		get_alarms (): TAllAlarms {
			return this.alarms.toSorted((a, b) => a.day - b.day || a.hour - b.hour || a.minute - b.minute)
		},
	},

	actions: {
		set_alarms (a: TAllAlarms): void {
			this.alarms = a
		},
	},
})
