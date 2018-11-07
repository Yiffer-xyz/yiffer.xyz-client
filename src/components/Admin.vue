<template>
	<div style="width: 100%">
		<vue-headful :title="'Admin - Yiffer.xyz'"/>
    <h1>Admin</h1>
    <back-to-index></back-to-index>

		<div class="admin-content-container">

			<add-comic :comicList="[...comicList]"></add-comic>

			<add-keywords :comicList="[...comicList]" :keywordList="[...keywordList]"></add-keywords>

			<correct-comic :comicList="[...comicList]" :artistList="[...artistList]"></correct-comic>

			<div class="admin-content-box">
				<h2>Add a new comic</h2>
				<i class="fas fa-sort-down"></i>
			</div>



			<div class="admin-content-box">
				<h2>Add an artist</h2>
				<i class="fas fa-sort-down"></i>
			</div>


		</div>
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
// adding comic  with keywords
// adding artist with links
// rearrange pages
// 
// approving comics
// re calculate and zip
// mod stats

// SW A P    P A G E S   O M G    A ND REMOVE DUPLICATES

// husk å ta med upload progress

import config from '@/config.json'
import AddComic from '@/components/admin-panel/AddComic.vue'
import AddKeywords from '@/components/admin-panel/AddKeywords.vue'
import CorrectComic from '@/components/admin-panel/CorrectComic.vue'

export default {
	name: 'admin',
	components: {
		'login-modal': LoginModal,
		'back-to-index': BackToIndex,
		'add-comic': AddComic,
		'add-keywords': AddKeywords,
		'correct-comic': CorrectComic,
	},
	data: function () {
		return {
			comicList: [],
			keywordList: [],
			artistList: [],
		}
	},
	methods: {
		async mockGetComicList () {
			this.comicList = config.comicList
			this.keywordList = config.demoKeywords
			this.artistList = config.artistList
		},
  },
  created: function () {
		this.mockGetComicList()
  }
}

function mockPageUpload () { return {success: true} }

</script>

<style lang="scss">
$linkColor: #009fff;

.admin-content-container {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	max-width: 750px;
	margin: auto;
	justify-content: center;
}

.admin-content-box {
	width: 300px;
	border: 1px solid red;
	margin: 16px;
	height: 156px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 8px 8px 12px 8px;
	&:hover {
		cursor: pointer;
	}
}

.admin-content-box-open {
	width: 100%;
	height: auto;
	&:hover {
		cursor: initial;
	}
}

.admin-content-box-inner {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	> p, select, button, form {
		margin-bottom: 12px;
	}
}

.horizontal-flex {
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.dark {
}
</style>

