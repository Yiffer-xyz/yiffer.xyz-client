<template>
	<div style="width: 100%">
		<vue-headful :title="$route.params.artistName + ' - Artist - Yiffer.xyz'"/>
    <h1>Admin</h1>
    <back-to-index></back-to-index>

		<login-modal v-if="$store.state.loginModalVisibility"></login-modal>
	</div>
</template>

<script>
import LoginModal from '@/components/LoginModal.vue'
import BackToIndex from '@/components/BackToIndex.vue'

// tag suggestions bare hvis
// adding pages
// kw adding   with new kw
// correct comig
// adding comic
// adding artist with links
// 
// approving comics
// re calculate and zip
// mod stats


export default {
	name: 'admin',
	components: { 'login-modal': LoginModal, 'back-to-index': BackToIndex },
	data: function () {
		return {
		}
	},
	methods: {
  },
  created: function () {
  }
}
</script>

<style lang="scss">
$linkColor: #3984d4;

.dark {
}
</style>

