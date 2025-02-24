<template>
	<v-footer
		color='transparent'
		id='footer'
		absolute
		app
	>
		<v-row justify='center' align='center' class='no-gutters ma-0 pa-0' >

			<v-col cols='auto' class='no-gutters unselectable ma-0 pa-0'>

				<v-chip
					:ripple='false'
					color='offwhite'
					text-color='black'
					variant='flat'
					outlined
					pill
				>
					<section v-if='showBuild' class='' @click='buildInfo'>
						<span>site version: {{ appVersion }}</span>
						<span class='ml-3 '>built: {{ buildDate }}</span>
					</section>

					<section v-else>
						<a :href='href' target='_blank' rel='noopener noreferrer' class='text-caption'>
							<v-icon color='black' class='mr-2' href='' :icon='mdiGithub' />
						</a>
						<span @click='buildInfo' class=''>
							mrjackwills 2021 -
						</span>
					</section>
					
				</v-chip>
			</v-col>
		</v-row>
			
	</v-footer>
</template>

<script setup lang='ts'>

import { env } from '@/services/env';
import { mdiGithub } from '@mdi/js';

const [ piStatusStore, userStore ] = [ piStatusModule(), userModule() ];

const buildTimeout = ref(0);
const showBuild = ref(false);

const buildDate = env.build_date;
const href = env.homepage;

onUnmounted(() => {
	clearTimeout(buildTimeout.value);
});

const appVersion = computed(() => {
	return piStatusStore.piVersion;
});

const authenticated = computed(() => {
	return userStore.authenticated;
});

const buildInfo = (): void => {
	if (!authenticated.value || showBuild.value) return;
	showBuild.value = !showBuild.value;
	clearTimeout(buildTimeout.value);
	buildTimeout.value = window.setTimeout(() => {
		showBuild.value = false;
	}, 10000);
};

watch(authenticated, (i) => {
	if (!i) showBuild.value = false;
});
</script>

<style scoped>
.lowercase-button{
	text-transform: lowercase;
}

a {
	color: #000000!important;
	text-decoration: none;
}
</style>