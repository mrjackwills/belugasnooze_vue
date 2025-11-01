import type { TSnack } from '@/types'
import { mdiAlertCircle, mdiCheckCircleOutline } from '@mdi/js'

export function snackSuccess ({
	message = 'Success',
	icon = mdiCheckCircleOutline,
	timeout = 5000,
	loading = false,
}: TSnack): void {
	snackReset()
	const snack_store = snackbarModule()
	snack_store.set_icon(icon)
	snack_store.set_loading(loading)
	snack_store.set_message(message)
	snack_store.set_timeout(timeout)
	snack_store.set_visible(true)
}

export function snackError ({
	message = 'error',
	icon = mdiAlertCircle,
	timeout = 7500,
}: TSnack): void {
	snackReset()
	const snack_store = snackbarModule()
	snack_store.set_icon(icon)
	snack_store.set_message(message)
	snack_store.set_timeout(timeout)
	snack_store.set_visible(true)
}

export function snackReset (): void {
	const snack_store = snackbarModule()
	snack_store.$reset()
}
