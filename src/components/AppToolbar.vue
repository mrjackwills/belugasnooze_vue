<template>
	<v-toolbar :height='toolbarHeight' color='primary'>

		<v-img src='@/assets/logo.svg' :eager='true' :max-width='maxWidth' class='ml-2' />

		<v-toolbar-title :class='spacing' class='font-weight-bold'>
			<span class='text-white text-no-wrap'>Beluga Snooze</span>
		</v-toolbar-title>

		<StatusRow v-if='authenticated' />
		<v-progress-linear v-if='loading' :height='progressHeight' :indeterminate='loading' color='serious'
			location='bottom center' absolute />
	</v-toolbar>

</template>

<script setup lang='ts'>
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();

const [loadingStore, userStore] = [loadingModule(), userModule()];

const maxWidth = computed(() => mobile.value ? '2rem' : '3rem');
const authenticated = computed(() => userStore.authenticated);
const loading = computed(() => loadingStore.loading);
const progressHeight = computed(() => mobile.value ? '4' : '8');
const spacing = computed(() => mobile.value ? 'text-subtitle-1 py-2' : 'text-h5 py-1');
const toolbarHeight = computed(() => mobile.value ? '56' : '70');

</script>