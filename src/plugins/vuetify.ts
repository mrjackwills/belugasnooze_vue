import 'vuetify/styles';
import '../sass/variables.scss';

import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { createVuetify } from 'vuetify';

export default createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
	
	theme: {
		cspNonce: 'G64pI5YAn1mcBoR31VPK1n7LklcM74DQ8Z0mPeAKtcv0D0muQ4IAOyu1td6mh8Mk4DpfJayRr583Bmb6',
		themes: {
			light: {
				colors: {
					primary: '#c786d2',
					// pimary: '#ae50be',
					success: '#80CBC4',
					danger: '#FB8C00',
					serious: '#B71C1C',
					offwhite: '#ffeecb',
				},
			},
		},
	},
});
