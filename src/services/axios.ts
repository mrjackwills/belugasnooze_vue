import type { AxiosError, AxiosInstance } from 'axios'
import Axios from 'axios'
import { env } from '@/services/env'
import { snackError, snackReset } from './snack'

type ErrorData = { data: { response: number } }

function wrap (value: any, _context: ClassMethodDecoratorContext) {
	const original = value
	async function wrapped (this: any, ...args: any[]) {
		try {
			return await original.apply(this, args)
		} catch (error) {
			const e = error as AxiosError
			if (e.message === 'offline') {
				snackError({ message: 'Server offline' })
			} else if (e.response?.status === 429) {
				const p = e.response.data as ErrorData
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

class AxiosRequests {
	#wsAuthAxios!: AxiosInstance

	constructor () {
		this.#wsAuthAxios = Axios.create({
			baseURL: env.domain_token,
			withCredentials: false,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-control': 'no-cache',
			},
		})

		this.#wsAuthAxios.interceptors.response.use(config => Promise.resolve(config), error => error.response ? Promise.reject(error) : Promise.reject(new Error('offline')))
	}

	@wrap
	async wsAuth_post (password: string): Promise<boolean> {
		const { data } = await this.#wsAuthAxios.post('', {
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
}

export const axiosRequests = new AxiosRequests()
