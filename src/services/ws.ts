import { env } from '@/services/env';

class CreateWs {
	ws?: WebSocket;

	get connection (): undefined | WebSocket {
		return userModule().authenticated ? this.ws : undefined;
	}

	openWs (token: string): void {
		if (userModule().authenticated) this.ws = new WebSocket(`${env.domain_wss}/${token}`);
	}
}

export const ws = new CreateWs();