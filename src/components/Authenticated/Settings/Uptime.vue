<template>
	<section>
		<section v-for='(item, index) in uptimeNameAndValues' :key='index' >
			<v-row align='center' justify='center' no-gutters >
				<v-col cols='11' sm='6' class=' '>
					<v-row
						align='center'
						class='external-tooltip'
						justify='space-around'
						no-gutters
					>
						<v-col cols='5' class=' ma-0 pa-0'>
							<div class='text-overline font-weight-bold text-left' :class='computedColor'>
								<span :class='computedFontSize'>{{ item.name }}</span></div>
						</v-col>
						<v-col cols='7' class='ma-0 pa-0'>
							<div class='text-body-1 text-right' :class='computedColor'>
								<v-tooltip top v-if='item.tooltip'>
									<template v-slot:activator='{ on }'>
										<span v-on='on' class=''>{{ item.value }}</span>
									</template>
									<span>{{ item.tooltip }}</span>
								</v-tooltip>
								<span v-else>{{ item.value }}</span>
							</div>
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row v-if='index +1 !== uptimeNameAndValues.length' align='center' justify='center' no-gutters class='ma-0 pa-0' >
				<v-col cols='11' sm='6' ckass='ma-0 pa-0'>
					<v-divider />
				</v-col>
			</v-row>

		</section>
	</section>
</template>

<script lang='ts'>
import Vue from 'vue';

import { mapStores } from 'pinia';
import { piStatusModule } from '@/store';
import { TComputedUptime } from '@/types';
import { secondsToText } from '@/vanillaTS/secondsToText';

export default Vue.extend({
	name: 'uptime-settings-row',

	beforeMount () {
		if (this.$vuetify.breakpoint.mdAndUp) this.visible = true;
	},
	computed: {
		...mapStores(piStatusModule),

		uptimeNameAndValues (): Array<TComputedUptime> {
			return [
				{
					name: 'app uptime',
					tooltip: this.uptimeToString(this.piStatusStore.piAppUptime),
					value: this.secondsToDays(this.piStatusStore.piAppUptime)
				},
				{
					name: 'pi uptime',
					tooltip: this.uptimeToString(this.piStatusStore.piUptime),
					value: this.secondsToDays(this.piStatusStore.piUptime)
				},
				{
					name: 'websocket',
					tooltip: this.uptimeToString(this.piStatusStore.connectedFor),
					value: this.secondsToDays(this.piStatusStore.connectedFor)
				},
				{
					name: 'client version',
					value: String(this.piStatusStore.piVersion),
				},
			];

		},
		computedColor (): string {
			return this.piOnline ? '': 'serious--text';
		},
		computedIconColor (): string {
			return this.piOnline ? '': 'serious';
		},
		computedFontSize (): string {
			return this.$vuetify.breakpoint.smAndDown ? 'small-text' : '';
		},
		infoColor (): string {
			return this.visible ? 'danger' : 'black';
		},
		piOnline (): boolean {
			return this.piStatusStore.online;
		},
	},

	data: () => ({
		visible: false
	}),

	methods: {
		uptimeToString (time: number|undefined) : string {
			if (!time || isNaN(time)) return 'NULL';
			const now = Math.trunc(Date.now()/1000);
			const t = (now - time) * 1000;
			return new Date(t).toString();
		},
		secondsToDays (s: number|undefined): string {
			if (isNaN(Number(s))) return 'NULL';
			return secondsToText(Number(s), this.$vuetify.breakpoint.smAndDown);
		}
	},

});
</script>