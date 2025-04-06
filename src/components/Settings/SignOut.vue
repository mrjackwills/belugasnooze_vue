<template>
	<v-row justify='end' class='my-2'>
		<v-col cols='auto'>
			<v-btn @click='signOut' class='elevation-0' color='red' variant='outlined' size='small'>
				<v-icon style='vertical-align: middle;' class='mr-2' size='small' dark :icon='mdiLogoutVariant' />
				<span>signout</span>
			</v-btn>
		</v-col>
	</v-row>

</template>

<script setup lang='ts'>

import { mdiLogoutVariant } from '@mdi/js';

const signOut = async (): Promise<void> => {
	wsModule().closeWS();
	userModule().signout();
};

</script>