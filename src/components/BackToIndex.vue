<template>
	<router-link :to="'/'" class="underline-link">
		<home-icon/> back to index
	</router-link>
</template>

<script>
import HomeIcon from 'vue-material-design-icons/Home.vue'
export default {
	name: 'backToIndex',
	components: { HomeIcon }
}
</script>
