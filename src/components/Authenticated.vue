<template>
	<v-row justify='center' align='center' no-gutters>
		<v-col class=''>
			<v-expand-transition>
				<section v-if='!expandedSettings'>
					<app-add-alarm  />
					<app-light-controls />
					<app-alarms-list />
				</section>
			</v-expand-transition>
			<app-settings />
		</v-col>
	</v-row>
</template>

<script lang='ts'>

import Vue from 'vue';

import { alarmModule, lightModule, loadingModule, piStatusModule, settingsModule, userModule, wsModule } from '@/store';
import { mapStores } from 'pinia';
import { snackError } from '@/services/snack';
import { TWSFromPi, TAllAlarms, TTime, TTimeAndTimeZone, TError, TData } from '@/types';
import { parse } from 'secure-json-parse';
import { ws } from '@/services/WS';
import AddAlarm from '@/components/Authenticated/AddAlarm.vue';
import AlarmsList from '@/components/Authenticated/AlarmsList.vue';
import LightControls from '@/components/Authenticated/LightControls.vue';
import Settings from '@/components/Authenticated/Settings.vue';

export default Vue.extend({
	name: 'authenticated-component',

	components: {
		appAddAlarm: AddAlarm,
		appAlarmsList: AlarmsList,
		appLightControls: LightControls,
		appSettings: Settings,
	},

	async beforeDestroy () {
		this.clearAllIntervals();
	},
	
	computed: {
		...mapStores(alarmModule, lightModule, loadingModule, piStatusModule, settingsModule, userModule, wsModule),
		
		alarms (): TAllAlarms {
			return this.alarmsStore.get_alarms;
		},
		expandedSettings (): boolean {
			return this.settingsStore.expanded;
		},
		loading (): boolean {
			return this.loadingStore.loading;
		},
		piInit (): boolean {
			return this.piStatusStore.init;
		},
		piUptime: {
			get (): number {
				return this.piStatusStore.piUptime;
			},
			set (n: number): void {
				this.piStatusStore.set_piUptime(n);
			}
		},
		websocketUptime: {
			get (): number {
				return this.piStatusStore.connectedFor;
			},
			set (n: number): void {
				this.piStatusStore.set_connectedFor(n);
			}
		},
		appUptime: {
			get (): number {
				return this.piStatusStore.piAppUptime;
			},
			set (n: number): void {
				this.piStatusStore.set_piAppUptime(n);
			}
		},
		piTime: {
			get (): TTime {
				return this.piStatusStore.time;
			},
			set (s: TTime): void {
				this.piStatusStore.set_time(s);
			}
		},
		ws_connected (): boolean {
			return this.websocketStore.connected;
		}
	},

	data: () => ({
		init: false,
		initCount: 0,
		initTimeout: 0,
		piTimeInterval: 0,
	}),

	methods: {

		addHandlers (): void {
			ws?.connection?.addEventListener('message', (data) => {
				this.wsDataHandler(parse(data.data, undefined, { protoAction: 'remove', constructorAction: 'remove' }));
			});
			
			this.send_init();

			ws?.connection?.addEventListener('close', (_event) => {
				this.userStore.signout();
				this.websocketStore.closeWS();
			});
		
		},

		send_init () {
			this.websocketStore.send({ name: 'status' });
			this.websocketStore.send({ name: 'led_status' });
		},

		clearAllIntervals (): void {
			clearInterval(this.piTimeInterval);
		},

		closeWS (): void {
			if (!this.ws_connected) return;
			this.websocketStore.closeWS();
		},

		initCheck () : void {
			this.initCount ++;
			this.initTimeout = window.setTimeout(() => {
				if (this.init) clearInterval(this.initTimeout);
				else if (this.initCount < 4) {
					this.send_init();
					this.initCheck();
				}
				else {
					snackError({ message: 'unable to contact pi' });
					this.websocketStore.closeWS();
					this.userStore.signout();
				}
			}, 3000);
		},

		setPiTime (): void {
			clearInterval(this.piTimeInterval);
			if (!this.piTime) return;
			this.piTimeInterval = window.setInterval(() => {

				// This is update the pi/ws/app uptime times each second as well
				// but without a monospaced font it messes up the widths
				// this.piUptime += 1;
				// this.appUptime += 1;
				// this.websocketUptime += 1;

				// if system time increase that as well
				this.piTime.seconds = Number(this.piTime.seconds) + 1;
				if (this.piTime.seconds === 60) {
					this.piTime.seconds = 0;
					this.piTime.minutes = Number(this.piTime.minutes) + 1;
				}
				if (this.piTime.minutes === 60) {
					this.piTime.minutes = 0;
					this.piTime.hours = Number(this.piTime.hours) + 1;
				}
				if (this.piTime.hours === 24) this.piTime.hours = 0;
			}, 1000);
		},

		cacheTime (timezone: string): TTimeAndTimeZone {

			const tzOptions: Intl.DateTimeFormatOptions = {
				timeZone: timezone,
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				hour12: false
			};
			const tempDate = new Intl.DateTimeFormat([], tzOptions);
			const formatedDate = tempDate.format(new Date());
			return {
				time: {
					hours: Number(formatedDate.toString().substring(0, 2)),
					minutes: Number(formatedDate.toString().substring(3, 5)),
					seconds: Number(formatedDate.toString().substring(6, 8)),
				},
				timezone
			};
		},

		//  isApiKey  (input: unknown): input is ApiKey => typeof input !== 'string' ? false : !!input.match(/^([a-f0-9]{128})$/gi);
		errorGuard (i: unknown): i is TError {
			return Object.prototype.hasOwnProperty.call(i, 'error');
		},
		dataGuard (i: unknown): i is TData {
			return Object.prototype.hasOwnProperty.call(i, 'data');
		},
		
		wsDataHandler (message: TWSFromPi): void {
			this.init = true;
			this.initCount = 0;
			
			if (this.errorGuard(message)) return snackError({ message: message.error.message });
			
			if (this.dataGuard(message)) {
				if (message.cache) this.piStatusStore.set_online(false);
				else this.piStatusStore.set_online(true);
				switch (message.data.name) {
				case 'status':
					const formattedTimeAndTimeZone = this.cacheTime(message.data.data.time_zone);
					this.piStatusStore.set_internalIp(message.data.data.internal_ip);
					this.piStatusStore.set_piVersion(message.data.data.version);
					this.piStatusStore.set_piAppUptime(message.data.data.uptime_app);
					this.piStatusStore.set_piUptime(message.data.data.uptime);
					this.piStatusStore.set_time(formattedTimeAndTimeZone.time);
					this.piStatusStore.set_timeZone(message.data.data.time_zone);
					this.piStatusStore.set_connectedFor(message.data.data.connected_for);
					this.setPiTime();
					this.piStatusStore.set_init(true);
					this.alarmsStore.set_alarms(message.data.data.alarms);
					break;
				case 'led_status':
					this.lightStore.set_on(message.data.data.status);
					break;
				}
			}
		}
	},

	mounted () {
		this.initCheck();
	},

	watch: {
		ws_connected (i): void {
			if (i) {
				this.addHandlers();
				this.setPiTime();
			}
		}
	},
});
</script>
