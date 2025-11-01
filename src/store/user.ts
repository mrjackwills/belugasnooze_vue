import { defineStore } from 'pinia'
import { ModuleName } from '@/types'

export const userModule = defineStore(ModuleName.User, {

	state: () => ({ authenticated: false }),

	actions: {
		set_authenticated (value: boolean) {
			this.authenticated = value
		},
		signout () {
			this.set_authenticated(false)
			alarmModule().$reset()
			piStatusModule().$reset()
			settingsModule().$reset()
		},
	},
})
