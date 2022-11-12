<template>
	<v-container
		class='fill-height'
		fluid
	>
		<v-row
			align='center'
			justify='center'
			class='fill-height'
		>
			<v-col cols='10' md='8' >
				<v-card transition='fade-transition' class='' >
					<AppToolbar />
					<v-card-text class=''>
						<v-fade-transition group hide-on-leave>
							<component

								:is='computedComponent'
								:key='computedComponent'
							/>
						</v-fade-transition>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang='ts'>
import AppSignin from '@/components/AppSignin.vue';
import AppAuthenticated from '@/components/AppAuthenticated.vue';
import AppToolbar from '@/components/AppToolbar.vue';
const [ lightStore, userStore ] = [ lightModule(), userModule() ];

const authenticated = computed(() => {
	return userStore.authenticated;
});
const computedComponent = computed(() => {
	return authenticated.value ? AppAuthenticated : AppSignin;
});

const lightOn = computed((): boolean =>{
	return lightStore.on;
});

watch(lightOn, (i) => {
	let title = i ? 'light on 💡' : '';
	pagetitleModule().set_title(title);
});

</script>