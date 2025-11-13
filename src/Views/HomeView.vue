<template>
	<v-container
		class='fill-height'
		fluid
	>
		<v-row
			align='center'
			class='fill-height'
			justify='center'
		>
			<v-col cols='10' md='8'>
				<v-card transition='fade-transition'>
					<AppToolbar />
					<v-card-text>
						<v-fade-transition hide-on-leave>
							<component
								:is='computedComponent'
								:key
							/>
						</v-fade-transition>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang='ts'>
import AppAuthenticated from '@/components/AppAuthenticated.vue'
import AppSignin from '@/components/AppSignin.vue'
import AppToolbar from '@/components/AppToolbar.vue'
const [lightStore, userStore] = [lightModule(), userModule()]

const authenticated = computed(() => userStore.authenticated)
const computedComponent = computed(() => authenticated.value ? AppAuthenticated : AppSignin)
const key = computed(() => authenticated.value ? 'AppAuthenticated' : 'AppSignin')
const lightOn = computed((): boolean => lightStore.on)

watch(lightOn, i => {
	const title = i ? 'light on 💡' : ''
	pagetitleModule().set_title(title)
})

</script>
