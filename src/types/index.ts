export type u<T> = T | undefined;
export type su = u<string>;
export type nu = u<number>;

type TAlarm = TDayHourMinute;
type TDbAlarms = TAlarm & TAlarmId;
type TBaseNames = TSendName | 'offline';
type TWSToServerNames = TBaseNames | 'add_alarm' | 'delete_all' | 'delete_one' | 'light' | 'restart' | 'time_zone';
type TDayHourMinute = THourMinute & { day: number };
type TEmitName = 'delete_one' | 'delete_all';
type TStatus = {
	name: 'status';
	data: TStatusAndAlarms; 
} | { 
	name: 'led_status';
	data: TLightStatus;
};

export type TTime = Record<'hours' | 'minutes' | 'seconds', number | undefined>;

export type TTimeAndTimeZone = {
	time: TTime;
	timezone: string; 
};

export type TEmitBody = {
	name: TEmitName;
	body?: { alarm_id: number };
};

export type TSendName = 'status' | 'led_status';

type TLightStatus = { status: boolean };
type TTimeZone = { zone: string };

export type IWSToServer = {
	name: TWSToServerNames;
	body?: TLightStatus | TVueAlarm | string | TAlarmId | TTimeZone;
};

export type TVueAlarm = THourMinute & { days: Array<number> };

export type THourMinute = Record<'hour' | 'minute', number>;

export type TAlarmId = { alarm_id: number };

export type TAllAlarms = Array<TDbAlarms>;

export type TPiStatus = Record<'internal_ip' | 'version' | 'time_zone', string> & Record<'uptime' | 'uptime_app' | 'connected_for', number>;

export type TStatusAndAlarms = TPiStatus & { alarms: TAllAlarms };

export type TData = {
	data: TStatus;
	cache?: boolean; 
};

export type TError = {
	error: {
		message: string;
		code: number; 
	}; 
};

export type TWSFromPi = TData | TError;

export type TSnack = {
	message?: string;
	icon?: string;
	timeout?: number;
	loading?: boolean;
};

export type TComputedUptime = Record<'name' | 'value', string> & { tooltip?: string };

export type TComputedCity = Record<'value' | 'title', string>;

export type TComputedIp = Record<'name' | 'class', string> & {
	value: su;
	model: boolean; 
};

export type TDayOptions = {
	value: number;
	text: string; 
};


export type PiniaModuleName = 'alarms' |
	'light' |
	'loading' |
	'piStatus' |
	'settings' |
	'snackbar' |
	'user' |
	'websocket' |
	'pageTitle';