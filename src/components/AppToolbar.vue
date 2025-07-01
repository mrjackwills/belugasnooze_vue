<template>
	<v-toolbar :height='toolbarHeight' color='primary'>

		<v-img src='@/assets/logo.svg' :eager='true' :max-width='maxWidth' class='mx-2' />

		<v-toolbar-title :class='fontSize' class='ma-0 pa-0 font-weight-bold'>
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

const authenticated = computed(() => userStore.authenticated);
const loading = computed(() => loadingStore.loading);
const maxWidth = computed(() => mobile.value ? '2rem' : '3rem');
const progressHeight = computed(() => mobile.value ? '4' : '8');
const fontSize = computed(() => mobile.value ? 'text-subtitle-1' : 'text-h5');
const toolbarHeight = computed(() => mobile.value ? '56' : '70');

</script>
