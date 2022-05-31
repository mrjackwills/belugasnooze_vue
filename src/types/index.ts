
export type u<T> = T | undefined
export type su = u<string>
export type nu = u<number>

type TAlarm = TDayHourMinute
type TDbAlarms = TAlarm & TAlarmId
type TBaseNames = TSendName | 'offline';
type TWSToServerNames = TBaseNames | 'add_alarm' | 'delete_all' | 'delete_one' | 'light' | 'restart' | 'time_zone';
type TDayHourMinute = THourMinute & { day:number }
type TEmitName = 'delete_one' | 'delete_all'
type TStatus = {name: 'status', data: TStatusAndAlarms} | {name: 'led_status', data: TLightStatus }

export type TTime = { [ K in 'hours' | 'minutes' | 'seconds'] : number | undefined }

export type TTimeAndTimeZone = {time: TTime, timezone: string}

export type TEmitBody = {
	name: TEmitName,
	body?: { alarm_id: number }
}

export type TSendName = 'status' | 'led_status'

// export type TWifi = { [ K in 'ssid' | 'password']: string }
type TLightStatus = {status: boolean}
type TTimeZone = {zone: string}

export type IWSToServer = {
	name: TWSToServerNames;
	body?: TLightStatus | TVueAlarm | string | TAlarmId |TTimeZone;
}

export type TVueAlarm = THourMinute & { days: Array<number> }

export type THourMinute = { [ K in 'hour' | 'minute']: number }

export type TAlarmId = { alarm_id: number }

export type TAllAlarms = Array<TDbAlarms>;

export type TPiStatus = {[ K in 'internal_ip' | 'version' |'time_zone'] : string } & {[ K in 'uptime' | 'uptime_app' |'connected_for'] :number }

export type TStatusAndAlarms = TPiStatus & { alarms: TAllAlarms }

export type TData = { data: TStatus, cache? :boolean}

export type TError = {error: {message: string, code: number}}

export type TWSFromPi = TData | TError

export type TSnack = {
		message?: string,
		icon?: string
		timeout?: number,
		loading?: boolean
	}

export type TComputedUptime = { [ K in 'name' | 'value' ] : string } & { tooltip?: string }

export type TComputedCity = { [ k in 'value' | 'text']: string }

export type TComputedIp = { [ K in 'name' | 'class'] : string } & { value: su, model: boolean }

export type TDayOptions = {value: number, text: string}