<template>
	<v-toolbar
		:height='toolbarHeight'
		color='primary'
	>

		<v-img src='@/assets/logo.svg' :eager='true' max-width='3rem' class='ml-2' />
				
		<v-toolbar-title
			:class='spacing'
			class='font-weight-bold'
		>
			<span class='text-white text-no-wrap'>Beluga Snooze</span>
		</v-toolbar-title>
			
		<StatusRow v-if='authenticated'/>
		<v-progress-linear
			v-if='loading'
			:height='progressHeight'
			:indeterminate='loading'
			color='serious'
			location='bottom center'
			absolute
		/>
	</v-toolbar>
		
</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();

const [ loadingStore, userStore ] = [ loadingModule(), userModule() ];

const authenticated = computed(() => {
	return userStore.authenticated;
});

const loading = computed(() => {
	return loadingStore.loading;
});

const progressHeight = computed(() => {
	return mobile.value ? '4' : '8';
});

const spacing = computed(() => {
	return mobile.value ? 'text-h6 py-2' : 'text-h5 my-1';
});

const toolbarHeight = computed(() => {
	return mobile.value ? '56' : '70';
});

</script>