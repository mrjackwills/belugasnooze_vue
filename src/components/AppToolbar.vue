<template>
	<v-toolbar
		:height='toolbarHeight'
		color='primary'
		flat
	>

		<v-img src='@/assets/logo.svg' :eager='true' max-width='40px' class='ml-2' />

		<v-toolbar-title
			:class='spacing'
			class='font-weight-bold'
		>
			<span class='text-white text-no-wrap'>Beluga Snooze</span>
		</v-toolbar-title>

		<StatusRow v-if='authenticated ' />
		
	</v-toolbar>

	<v-progress-linear
		:active='loading'
		:height='progressHeight'
		:indeterminate='loading'
		color='serious'
		bg-opacity='1'
		bg-color='primary'
		bottom
		absolute
	/>
		
</template>

<script setup lang='ts'>
import StatusRow from '@/components/Toolbar/StatusRow.vue';

import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();

const [ loadingStore, userStore ] = [ loadingModule(), userModule() ];

const authenticated = computed(() => {
	return userStore.authenticated;
});

const loading = computed(() => {
	return loadingStore.loading;
});

// const logoWidth = computed(() => {
// 	return mobile.value ? '40px' : '55px';
// });

const progressHeight = computed(() => {
	return mobile.value ? '8' : '4';
});

const spacing = computed(() => {
	return mobile.value ? 'text-h6 py-2' : 'text-h5 my-1';
});

const toolbarHeight = computed(() => {
	return mobile.value ? '56' : '70';
});

</script>