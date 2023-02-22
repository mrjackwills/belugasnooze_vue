import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';
import type { TTime } from '@/types';

export const piStatusModule = defineStore(ModuleName.Pistatus, {

	state: () => ({
		init: false,
		internalIp: '',
		online: false,
		connectedFor: 0,
		piAppUptime: 0,
		piUptime: 0,
		piVersion: '',
		time: { hours: 0, minutes: 0, seconds: 0 } as TTime,
		timeZone: '',
	}),

	actions: {
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
