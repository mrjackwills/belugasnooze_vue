import { mdiAlertCircle, mdiCheckCircleOutline } from '@mdi/js';
import { snackbarModule } from '@/store';
import { TSnack } from '@/types';

export const snackSuccess = ({ message = 'Success', icon = mdiCheckCircleOutline, timeout=5000, loading=false }: TSnack): void => {
	snackReset();
	const snack_store = snackbarModule();
	snack_store.set_icon(icon);
	snack_store.set_loading(loading);
	snack_store.set_message(message);
	snack_store.set_timeout(timeout);
	snack_store.set_visible(true);
};

export const snackError = ({ message = 'error', icon = mdiAlertCircle, timeout=7500 }: TSnack): void =>{
	snackReset();
	const snack_store = snackbarModule();
	snack_store.set_icon(icon);
	snack_store.set_message(message);
	snack_store.set_timeout(timeout);
	snack_store.set_visible(true);
};

export const snackReset = (): void => {
	const snack_store = snackbarModule();
	snack_store.$reset();

};