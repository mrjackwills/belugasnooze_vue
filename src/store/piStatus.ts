import { defineStore } from 'pinia';
import type { TTime } from '@/types';
import { ModuleName } from '@/types/const_module';

export const piStatusModule = defineStore(ModuleName.PiStatus, {

	state: () => ({
		init: false,
		internalIp: '',
		online: false,
		connectedFor: 0,
		piAppUptime: 0,
		piUptime: 0,
		piVersion: '',
		time: {
			hours: 0,
			minutes: 0,
			seconds: 0
		} as TTime,
		timeZone: ''
	}),

	actions: {
		increment_timers (): void {
			this.connectedFor++;
			this.piAppUptime++;
			this.piUptime++;
		},
		set_connectedFor (n: number): void {
			this.connectedFor = n;
		},
		set_init (b: boolean): void {
			this.init = b;
		},
		set_internalIp (su: string): void {
			this.internalIp = su;
		},
		set_online (b: boolean): void {
			this.online = b;
			this.init = true;
		},
		set_piAppUptime (nu: number): void {
			this.piAppUptime = nu;
		},
		set_piUptime (nu: number): void {
			this.piUptime = nu;
		},
		set_piVersion (su: string): void {
			this.piVersion = su;
		},
		set_time (t: TTime): void {
			this.time = t;
		},
		set_timeZone (t: string): void {
			this.timeZone = t;
		}
	}
});
