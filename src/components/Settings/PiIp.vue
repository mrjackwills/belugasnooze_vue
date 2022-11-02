<template>
	<section class='mt-4'>
		<section v-for='(item, index) in namesAndValues' :key='index' >
			<v-row align='center' justify='center' no-gutters @click='click(item.class)' >
				<v-col cols='11' sm='6'>
					<v-row
						
						:class='item.class'
						align='center'
						justify='space-around'
					>
						<v-col cols='5' class=' '>
							<div class='text-overline font-weight-bold text-left unselectable' :class='computedColor'>
								<span :class='computedFontSize'>{{ item.name }}</span>
							</div>
						</v-col>
						<v-col cols='7'>
							<v-tooltip
								v-model='item.model'
								top
							>
								<template v-slot:activator='{ props }'>
									<div v-bind='props' class='text-body-1 text-right' :class='computedColor'>
										<span :class='computedFontSize' class='mono-numbers'>{{ item.value }}</span>
									</div>
								</template>
								<span>{{ item.name }} copied</span>
							</v-tooltip>
						
						</v-col>
					</v-row>
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

<script setup lang='ts'>
import type { TComputedIp, } from '@/types';
import { useClipboard } from '@vueuse/core';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
const piStatusStore = piStatusModule();

onUnmounted(() => {
	clearTimeout(showInternalTimeout.value);
	clearTimeout(showExternalTimeout.value);
	[ showExternal.value, showInternal.value, ] = [ false, false ];
});

const computedColor = computed(() => {
	return piOnline.value ? '': 'serious--text';
});
const computedFontSize = computed((): string =>{
	return mobile.value ? 'small-text' : '';
});
const internalIp = computed(() => {
	return piStatusStore.internalIp;
});
const piOnline = computed(() => {
	return piStatusStore.online;
});
const namesAndValues = computed((): Array<TComputedIp> => {
	return [
		{
			class: 'internal',
			model: showInternal.value,
			name: 'internal ip',
			value: internalIp.value
		},
	];
});

const showExternal = ref(false);
const showExternalTimeout = ref(0);
const showInternal = ref(false);
const showInternalTimeout = ref(0);

const click = (name: string): void => {
	switch (name) {
	case 'internal':
		showInternalTooltip();
		break;
	}
};

const showInternalTooltip = (): void => {
	if (!internalIp.value) return;
	useClipboard().copy(internalIp.value);
	showInternal.value = true;
	showInternalTimeout.value = window.setTimeout (() => {
		showInternal.value = false;
	}, 750);
};
</script>