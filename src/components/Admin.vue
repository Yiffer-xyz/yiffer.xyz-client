<template>
	<div style="width: 100%">
		<vue-headful :title="'Admin - Yiffer.xyz'"/>
    <h1>Admin</h1>
    <back-to-index></back-to-index>

		<div class="admin-content-container">
			<div class="admin-content-box">
				<h2>Add pages to comic</h2>
					<span class="admin-content-box-inner">
						<p>Files must be either .jpg or .png. File name does not matter, except for ordering:</p>
						<p>If adding multiple pages, it is <i>very important</i> that they are named in some 
							ascending order. Example: <tt>01.jpg, 02.jpg, ...</tt>, or 
							<tt>a.jpg, b.jpg, ...</tt>. Note that <tt>1.jpg, 2.jpg, ...</tt> will not work for
							more than 9 pages!</p>
						<span class="horizontal-flex">
							<select v-model="addPagesComic">
								<option v-for="comic in addPagesComicList" v-bind:key="comic.id">
									{{comic.name}} {{comic.finished ? '(Finished!)' : ''}}
								</option>
							</select>

							<input type="file" multiple="true" @change="processFileUploadChange" id="comic" class="y-button"/>
							<button class="y-button" @click="uploadAddPages" v-show="addPagesFiles.length > 0 && addPagesComic">Upload files</button>

							<p class="error-message" v-if="addPagesErrorMessage">{{addPagesErrorMessage}}</p>
							<p class="success-message" v-if="addPagesSuccessMessage">{{addPagesSuccessMessage}}</p>
						</span>
					</span>
				<p>Upload new pages, .png or .jpg, any file name</p>
				<i class="fas fa-sort-down"></i>
			</div>



			<div class="admin-content-box">
				<h2>Add tags to comic</h2>
				<i class="fas fa-sort-down"></i>
			</div>



			<div class="admin-content-box">
				<h2>Correct comic info</h2>
				<p>Change the metadata, finished status, artist</p>
				<i class="fas fa-sort-down"></i>
			</div>



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

// husk å ta med upload progress


export default {
	name: 'admin',
	components: { 'login-modal': LoginModal, 'back-to-index': BackToIndex },
	data: function () {
		return {
			addPagesComicList: [],
			addPagesFiles: [],
			keywordSuggestionList: [],
			allKeywordsList: [],

		}
	},
	methods: {
		async processFileUploadChange (fileEvent) {
			let response = await mockPageUpload()
			// todo actually make the request

			if (response.success) {
				this.addPagesSuccessMessage = `Upload success (${this.addPagesComic})`
				this.addPagesErrorMessage = ''
				this.addPagesComic = undefined
				// todo empty input files / pages
			}
			else {
				this.addPagesErrorMessage = `Upload failure: ${response.message}`
				this.addPagesSuccessMessage = ''
			}
		},
		uploadAddPages () {

		}
  },
  created: function () {
  }
}

function mockPageUpload () { return {success: true} }
</script>

<style lang="scss">
$linkColor: #3984d4;

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
	padding: 8px;
	&:hover {
		cursor: pointer;
	}
	i {

	}
}

.dark {
}
</style>

