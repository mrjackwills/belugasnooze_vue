class Env {
	readonly #api_key = String(process.env.VUE_APP_APIKEY);
	readonly #app_version = String(process.env.VUE_APP_VERSION);
	readonly #domain_token = String(process.env.VUE_APP_TOKEN_DOMAIN);
	readonly #domain_wss = String(process.env.VUE_APP_WSS_DOMAIN);
	readonly #build_date = String(process.env.VUE_APP_DATE);
	readonly #github = String(process.env.VUE_APP_GITHUB);
	readonly #mode_production = process.env.VUE_APP_MODE === 'production' ;

	get api_key (): string {
		return this.#api_key;
	}

	get app_version (): string {
		return this.#app_version;
	}

	get build_date (): string {
		return this.#build_date;
	}

	get domain_token (): string {
		return this.#domain_token;
	}

	get domain_wss (): string {
		return this.#domain_wss;
	}

	get github (): string {
		return this.#github;
	}

	get mode_production (): boolean {
		return this.#mode_production;
	}
}

export const env = new Env();