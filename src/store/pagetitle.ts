import { defineStore } from 'pinia'
import { ModuleName } from '@/types'

export const pagetitleModule = defineStore(ModuleName.PageTitle, {
	state: () => ({ title: '' }),

	actions: {
		set_title (value: string) {
			this.title = value
		},
	},
})
