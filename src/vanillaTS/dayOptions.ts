import { TDayOptions } from '@/types';

export const dayOptions: Readonly<Array<TDayOptions>> = [
	{ value: 0, text: 'Mon' },
	{ value: 1, text: 'Tue' },
	{ value: 2, text: 'Wed' },
	{ value: 3, text: 'Thu' },
	{ value: 4, text: 'Fri' },
	{ value: 5, text: 'Sat' },
	{ value: 6, text: 'Sun' },
];

export const numToDay = (num: number) : string => {
	// fix for Sunday as both first and last day of the week, is always 0, but presented to user as 7 via pinia getter
	const data = num === 7 ? 0 : num;
	const index = dayOptions.findIndex((i) => i.value === data);
	return dayOptions[index]?.text ?? 'NULL';

};