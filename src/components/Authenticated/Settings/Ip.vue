<template>
	<section class='mt-4'>
		<section v-for='(item, index) in namesAndValues' :key='index' >
			<v-row align='center' justify='center' no-gutters >
				<v-col cols='11' sm='6'>
					<v-row
						@click='click(item.class)'
						:class='item.class'
						align='center'
						justify='space-around'
					>
						<v-col cols='5' class=' '>
							<div class='text-overline font-weight-bold text-left' :class='computedColor'>
								<span :class='computedFontSize'>{{ item.name }}</span></div>
						</v-col>
						<v-col cols='7' class=''>
							<div class='text-body-1 text-right' :class='computedColor'>
								<span >{{ item.value }}</span>
							</div>
						</v-col>
					</v-row>
					<v-tooltip
						v-model='item.model'
						:attach='`.${item.class}`'
						top
					>
						<template v-slot:activator='{ on }' >
							<div v-on='on' ></div>
						</template>
						<span>{{ item.name }} copied</span>
					</v-tooltip>
				</v-col>
			</v-row>

			<v-row v-if='piOnline || !piOnline && index  === 0' align='center' justify='center' no-gutters class='ma-0 pa-0' >
				<v-col cols='11' sm='6' >
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
import { TComputedIp, su } from '@/types';
import copy from 'clipboard-copy';

export default Vue.extend({
	name: 'ip-settings-row',

	beforeDestroy () {
		clearTimeout(this.showInternalTimeout);
		clearTimeout(this.showExternalTimeout);
		[ this.showExternal, this.showInternal, ] = [ false, false ];
	},

	computed: {
		...mapStores(piStatusModule),
		computedColor (): string {
			return this.piOnline ? '': 'serious--text';
		},
		computedFontSize (): string {
			return this.$vuetify.breakpoint.smAndDown ? 'small-text' : '';
		},
		internalIp (): su {
			return this.piStatusStore.internalIp;
		},
		piOnline (): boolean {
			return this.piStatusStore.online;
		},
		namesAndValues (): Array<TComputedIp> {
			return [
				{
					class: 'internal',
					model: this.showInternal,
					name: 'internal ip',
					value: this.internalIp,
				},
			];
		}
	},

	data: () => ({
		showExternal: false,
		showExternalTimeout: 0,
		showInternal: false,
		showInternalTimeout: 0,
	}),

	methods: {
		click (name: string): void {
			switch (name) {
			case 'internal':
				this.showInternalTooltip();
				break;
			}
		},
		showInternalTooltip (): void {
			if (!this.internalIp) return;
			copy(this.internalIp);
			this.showInternal = true;
			this.showInternalTimeout = window.setTimeout (() => {
				this.showInternal = false;
			}, 750);
		},
	}
});
</script>