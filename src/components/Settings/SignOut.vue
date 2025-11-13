<template>
	<v-row class='my-2' justify='end'>
		<v-col cols='auto'>
			<v-btn
				class='elevation-0'
				color='red'
				size='small'
				variant='outlined'
				@click='signOut'
			>
				<v-icon
					class='mr-2'
					dark
					:icon='mdiLogoutVariant'
					size='small'
					style='vertical-align: middle;'
				/>
				<span>signout</span>
			</v-btn>
		</v-col>
	</v-row>

</template>

<script setup lang='ts'>

import { mdiLogoutVariant } from '@mdi/js'

async function signOut (): Promise<void> {
	wsModule().closeWS()
	userModule().signout()
}

</script>
