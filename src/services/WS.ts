import { userModule } from '@/store';
import { env } from '@/vanillaTS/env';

class CreateWs {
	ws?: WebSocket

	get connection (): undefined | WebSocket {
		return userModule().authenticated ? this.ws : undefined;
	}

	openWs (password: string): void {
		if (userModule().authenticated) this.ws = new WebSocket(`${env.domain_wss}/${password}`, [ env.api_key ]);
	}
}

export const ws = new CreateWs();