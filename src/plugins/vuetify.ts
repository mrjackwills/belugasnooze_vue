import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import 'vuetify/styles'
import '../sass/variables.scss'

export default createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: { mdi },
	},

	theme: {
		themes: {
			light: {
				colors: {
					primary: '#C786D2',
					success: '#80CBC4',
					danger: '#FB8C00',
					serious: '#B71C1C',
					offwhite: '#ffeecb',
				},
			},
		},
	},
})
