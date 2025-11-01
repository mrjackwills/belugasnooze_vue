<template>
	<v-footer id='footer' absolute app color='transparent'>
		<v-row align='center' class='no-gutters ma-0 pa-0' justify='center'>

			<v-col class='no-gutters unselectable ma-0 pa-0' cols='auto'>

				<v-chip
					color='offwhite'
					outlined
					pill
					:ripple='false'
					text-color='black'
					variant='flat'
				>
					<section v-if='showBuild' class='' @click='buildInfo'>
						<span>site version: {{ appVersion }}</span>
						<span class='ml-3 '>built: {{ buildDate }}</span>
					</section>

					<section v-else>
						<a class='text-caption' :href rel='noopener noreferrer' target='_blank'>
							<v-icon class='mr-2' color='black' href='' :icon='mdiGithub' />
						</a>
						<span class='' @click='buildInfo'>
							mrjackwills 2021 -
						</span>
					</section>

				</v-chip>
			</v-col>
		</v-row>

	</v-footer>
</template>

<script setup lang='ts'>

import { mdiGithub } from '@mdi/js'
import { env } from '@/services/env'

const [piStatusStore, userStore] = [piStatusModule(), userModule()]

const buildTimeout = ref(0)
const showBuild = ref(false)

const buildDate = env.build_date
const href = env.homepage

onUnmounted(() => {
	clearTimeout(buildTimeout.value)
})

const appVersion = computed(() => piStatusStore.piVersion)
const authenticated = computed(() => userStore.authenticated)

function buildInfo (): void {
	if (!authenticated.value || showBuild.value) return
	showBuild.value = !showBuild.value
	clearTimeout(buildTimeout.value)
	buildTimeout.value = window.setTimeout(() => {
		showBuild.value = false
	}, 10_000)
}

watch(authenticated, i => {
	if (!i) showBuild.value = false
})
</script>

<style scoped>
.lowercase-button {
    text-transform: lowercase;
}

a {
    color: #000000 !important;
    text-decoration: none;
}
</style>
