import { defineStore } from 'pinia'
import { ModuleName } from '@/types'

export const lightModule = defineStore(ModuleName.Light, {

	state: () => ({ on: false }),

	actions: {
		set_on (value: boolean) {
			this.on = value
		},
	},
})
