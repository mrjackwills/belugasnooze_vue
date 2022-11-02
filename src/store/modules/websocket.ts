import { defineStore } from 'pinia';
import type { IWSToServer } from '@/types';
import { ModuleName } from '@/types/enum_module';
import { userModule } from '@/store';
import { ws } from '@/services/ws';

export const wsModule = defineStore(ModuleName.Websocket, {

	state: () => ({
		connected: false,
	}),

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

		send (data: IWSToServer) : void {
			ws?.connection?.send(JSON.stringify({ data }));
		},

		set_connected (value: boolean) {
			this.connected = value;
		},
		
	}
});
