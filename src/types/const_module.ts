import type { ConstT } from '@/types';

export const ModuleName = {
	Alarms: 'alarms',
	Light: 'light',
	Loading: 'loading',
	PiStatus: 'piStatus',
	Settings: 'settings',
	Snackbar: 'snackbar',
	User: 'user',
	Websocket: 'websocket',
	PageTitle: 'pageTitle'
} as const;

export type ModuleName = ConstT<typeof ModuleName>;
