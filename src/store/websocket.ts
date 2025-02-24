import { defineStore } from 'pinia';
import type { IWSToServer, PiniaModuleName } from '@/types';
import { ws } from '@/services/ws';

const name: PiniaModuleName = 'websocket';
export const wsModule = defineStore(name, {

	state: () => ({ connected: false }),

	actions: {

		closeWS (): void {
			this.set_connected(false);
			ws?.connection?.close();
		},

		openWS (password: string): void {
			const user_store = userModule();
			if (!user_store.authenticated) return;
			ws.openWs(password);
			ws.connection?.addEventListener('open', () => {
				this.set_connected(true);
			});
		},

		send (data: IWSToServer): void {
			ws?.connection?.send(JSON.stringify({ data }));
		},

		set_connected (value: boolean) {
			this.connected = value;
		}
		
	}
});
