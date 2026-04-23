import { env } from '@/services/env'
import { snackError, snackReset } from './snack'

type ErrorData = { data: { response: number } }

function wrap (value: any, _context: ClassMethodDecoratorContext) {
	const original = value
	async function wrapped (this: any, ...args: any[]) {
		try {
			return await original.apply(this, args)
		} catch (error) {
			const e = error as Error & { status?: number, data?: unknown }
			if (e.message === 'offline') {
				snackError({ message: 'Server offline' })
			} else if (e.status === 429) {
				const p = e.data as ErrorData
				const converted = Math.ceil(p.data.response / 1000)
				const message = `too many requests - please try again in ${converted} seconds `
				snackError({ message })
			} else {
				snackError({ message: 'unable to connect' })
			}
		}
	}
	return wrapped
}

class FetchRequests {
	#baseURL: string
	#defaultHeaders: HeadersInit

	constructor () {
		this.#baseURL = env.domain_token
		this.#defaultHeaders = {
			Accept: 'application/json',
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-cache',
		}
	}

	@wrap
	async wsAuth_post (password: string): Promise<boolean> {
		const data = await this.#post<{ response: string | null }>('', {
			key: env.api_key,
			password,
		})
		if (data.response) {
			snackReset()
			userModule().set_authenticated(true)
			wsModule().openWS(data?.response)
		}
		return !!data.response
	}

	async #post<T>(path: string, body: unknown): Promise<T> {
		let response: Response

		try {
			response = await fetch(`${this.#baseURL}${path}`, {
				method: 'POST',
				headers: this.#defaultHeaders,
				body: JSON.stringify(body),
			})
		} catch {
			throw new Error('offline')
		}

		if (!response.ok) {
			const data = await response.json().catch(() => null)
			const error = Object.assign(new Error(response.statusText), {
				status: response.status,
				data,
			})
			throw error
		}

		return response.json()
	}
}

export const fetchRequests = new FetchRequests()
