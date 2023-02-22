<template>
	<v-row justify='center' align='center' no-gutters>
		<v-col class=''>
			<v-expand-transition>
				<section v-if='!expandedSettings'>
					<AddAlarm />
					<LightControl />
					<AlarmList />
				</section>
			</v-expand-transition>
			<AppSettings />
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>

import { parse } from 'secure-json-parse';
import { snackError } from '@/services/snack';
import { ws } from '@/services/ws';
import AddAlarm from '@/components/Authenticated/AddAlarm.vue';
import AlarmList from '@/components/Authenticated/AlarmList.vue';
import LightControl from '@/components/Authenticated/LightControl.vue';
import AppSettings from '@/components/AppSettings.vue';
import type { TWSFromPi, TTime, TTimeAndTimeZone, TError, TData } from '@/types';

onUnmounted(() => {
	clearAllIntervals();
});
	
const [ alarmStore, lightStore, piStatusStore, settingsStore, userStore, wsStore ] = [ alarmModule(), lightModule(), piStatusModule(), settingsModule(), userModule(), wsModule() ];
		
const expandedSettings = computed(() => {
	return settingsStore.expanded;
});

const piTime = computed({
	get (): TTime {
		return piStatusStore.time;
	},
	set (s: TTime): void {
		piStatusStore.set_time(s);
	}
});
const ws_connected = computed(() => {
	return wsStore.connected;
});

const init = ref(false);
const initCount = ref(0);
const initTimeout = ref(0);
const piTimeInterval = ref(0);

const addHandlers = (): void => {
	ws?.connection?.addEventListener('message', (data) => {
		wsDataHandler(parse(data.data, undefined, { protoAction: 'remove', constructorAction: 'remove' }));
	});
	send_init();
	ws?.connection?.addEventListener('close', (_event) => {
		userStore.signout();
		wsStore.closeWS();
	});
};

const send_init = (): void => {
	wsStore.send({ name: 'status' });
	wsStore.send({ name: 'led_status' });
};

const clearAllIntervals = (): void => {
	clearInterval(piTimeInterval.value);
};

const initCheck = () : void => {
	initCount.value ++;
	initTimeout.value = window.setTimeout(() => {
		if (init.value) clearInterval(initTimeout.value);
		else if (initCount.value < 4) {
			send_init();
			initCheck();
		}
		else {
			snackError({ message: 'unable to contact pi' });
			wsStore.closeWS();
			userStore.signout();
		}
	}, 3000);
};

const setPiTime = (): void => {
	clearInterval(piTimeInterval.value);
	if (!piTime.value) return;
	piTimeInterval.value = window.setInterval(() => {
		piStatusModule().increment_timers();
		piTime.value.seconds = Number(piTime.value.seconds) + 1;
		if (piTime.value.seconds === 60) {
			piTime.value.seconds = 0;
			piTime.value.minutes = Number(piTime.value.minutes) + 1;
		}
		if (piTime.value.minutes === 60) {
			piTime.value.minutes = 0;
			piTime.value.hours = Number(piTime.value.hours) + 1;
		}
		if (piTime.value.hours === 24) piTime.value.hours = 0;
	}, 1000);
};

const cacheTime = (timezone: string): TTimeAndTimeZone => {

	const tzOptions: Intl.DateTimeFormatOptions = {
		timeZone: timezone,
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: false
	};
	const tempDate = new Intl.DateTimeFormat([], tzOptions);
	const formattedDate = tempDate.format(new Date());
	return {
		time: {
			hours: Number(formattedDate.toString().substring(0, 2)),
			minutes: Number(formattedDate.toString().substring(3, 5)),
			seconds: Number(formattedDate.toString().substring(6, 8)),
		},
		timezone
	};
};

const errorGuard = (i: unknown): i is TError => {
	return Object.prototype.hasOwnProperty.call(i, 'error');
};
const dataGuard = (i: unknown): i is TData => {
	return Object.prototype.hasOwnProperty.call(i, 'data');
};
		
const wsDataHandler = (message: TWSFromPi): void => {
	init.value = true;
	initCount.value = 0;
	if (errorGuard(message)) {
		return snackError({ message: message.error.message });
	}
	if (dataGuard(message)) {
		if (message.cache) piStatusStore.set_online(false);
		else piStatusStore.set_online(true);
		switch (message.data.name) {
		case 'status': {
			const formattedTimeAndTimeZone = cacheTime(message.data.data.time_zone);
			piStatusStore.set_internalIp(message.data.data.internal_ip);
			piStatusStore.set_piVersion(message.data.data.version);
			piStatusStore.set_piAppUptime(message.data.data.uptime_app);
			piStatusStore.set_piUptime(message.data.data.uptime);
			piStatusStore.set_time(formattedTimeAndTimeZone.time);
			piStatusStore.set_timeZone(message.data.data.time_zone);
			piStatusStore.set_connectedFor(message.data.data.connected_for);
			setPiTime();
			piStatusStore.set_init(true);
			alarmStore.set_alarms(message.data.data.alarms);
			break;
		}
		case 'led_status':
			lightStore.set_on(message.data.data.status);
			break;
		}
	}
};

onMounted(() => {
	initCheck();
});

watch(ws_connected, (i) => {
	if (i) {
		addHandlers();
		setPiTime();
	}
});

</script>
