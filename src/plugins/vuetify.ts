import { env } from '@/vanillaTS/env';
import Vue from 'vue';

import Vuetify, {
	VApp,
	VBtn,
	VCard,
	VCardActions,
	VCardText,
	VCheckbox,
	VChip,
	VCol,
	VContainer,
	VDivider,
	VExpandTransition,
	VFadeTransition,
	VFooter,
	VForm,
	VIcon,
	VList,
	VListItem,
	VListItemAction,
	VListItemAvatar,
	VListItemContent,
	VListItemGroup,
	VListItemTitle,
	VMain,
	VProgressCircular,
	VProgressLinear,
	VRow,
	VSelect,
	VSpacer,
	VSnackbar,
	VSwitch,
	VTextField,
	VToolbar,
	VToolbarTitle,
	VTooltip,
} from 'vuetify/lib';

Vue.use(Vuetify, {
	components: {
		VApp,
		VBtn,
		VCard,
		VCardActions,
		VCardText,
		VCheckbox,
		VChip,
		VCol,
		VContainer,
		VDivider,
		VExpandTransition,
		VFadeTransition,
		VFooter,
		VForm,
		VIcon,
		VList,
		VListItem,
		VListItemAction,
		VListItemAvatar,
		VListItemContent,
		VListItemGroup,
		VListItemTitle,
		VMain,
		VProgressCircular,
		VProgressLinear,
		VRow,
		VSelect,
		VSnackbar,
		VSpacer,
		VSwitch,
		VTextField,
		VToolbar,
		VToolbarTitle,
		VTooltip,
	},
});

const opts = {
	icons: {
		iconfont: <const>'mdiSvg',
	},
	theme: {
		options: {
			cspNonce: 'G64pI5YAn1mcBoR31VPK1n7LklcM74DQ8Z0mPeAKtcv0D0muQ4IAOyu1td6mh8Mk4DpfJayRr583Bmb6'
		},
		themes: {
			light: {
				primary: '#E1BEE7',
				success: '#80CBC4',
				danger: '#FB8C00',
				serious: '#B71C1C',
				offwhite: '#ffeecb',
			},
			options: {
				customProperties: true,
				minifyTheme: (css: string): string => env.mode_production ? css.replace(/[\s|\r\n|\r|\n]/g, ''): css,
			}
		}
	}
};
export default new Vuetify(opts);