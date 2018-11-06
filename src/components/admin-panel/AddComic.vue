<template>
  <div class="admin-content-box" @click="openComponent" v-bind:class="{'admin-content-box-open': isOpen}">
    <h2>Add pages to comic</h2>
    <span class="admin-content-box-inner" v-if="isOpen">
      <p>
        Files must be either .jpg or .png. File name does not matter, except for ordering.<br/>
        If adding multiple pages, it is <i>very important</i> that they are named in some 
        ascending order.<br/>
        Example:
        <span class="courier">[01.jpg, 02.jpg, ...]</span>, or 
        <span class="courier">[a.jpg, b.jpg, ...]</span>. Note that
        <span class="courier">[1.jpg, 2.jpg, ...]</span> will not work for more than 9 pages!
      </p>
      <select v-model="comic">
        <option v-for="comic in comicList" v-bind:key="comic.id" v-bind:value="comic">
          {{comic.name}} {{comic.finished ? '(Finished!)' : ''}}
        </option>
      </select>
      
      <form enctype="multipart/form-data" novalidate>
        <div class="pretty-input-upload">
          <input type="file" multiple="true" @change="processFileUploadChange" id="newPageFiles" accept="image/x-png,image/jpeg" class="input-file"/>
          <p>Select files</p>
        </div>
      </form>

      <p v-if="filesAreInput" style="margin-bottom: 0px;"><b>{{selectedFiles.length}}</b> Selected files:</p>
      <p v-if="filesAreInput" class="courier">{{selectedFileNames.join(', ')}}</p>

      <button @click="uploadFiles()" v-if="filesAreInput && comic" class="y-button">Upload files{{ comic.finished ? ' (NOTE: this comic is marked as finished!)' : ''}}</button>

      <p class="error-message" v-if="uploadErrorMessage">{{uploadErrorMessage}}</p>
      <p class="success-message" v-if="uploadSuccessMessage">{{uploadSuccessMessage}}</p>

      <i class="fas fa-sort-up arrow-symbol" @click="closeComponent"></i>
    </span>

    <span v-else>
      <p>Upload new pages, .png or .jpg, any file name</p>
      <i class="fas fa-sort-down arrow-symbol"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'addComic',
  props: {
    comicList: Array
  },
  data: function () {
    return {
      isOpen: false,
      comic: undefined,
      uploadErrorMessage: '',
      uploadSuccessMessage: '',
      selectedFiles: [],
    }
  },
  methods: {
    processFileUploadChange (changeEvent) {
      this.selectedFiles = [...changeEvent.target.files]
    },
    uploadFiles () {
      let response = {success: true, message: ''}
      // response = {success: false, message: 'This is something weronggggggggg gggg'}

      if (response.success) {
        this.uploadSuccessMessage = 'Success updating ' + this.comic.name
        this.uploadErrorMessage = ''
        this.selectedFiles = []
        document.getElementById('newPageFiles').value = ''
      }
      else {
        this.uploadErrorMessage = 'Error updating: ' + response.message
        this.uploadSuccessMessage = ''
      }
    },
    openComponent () { if (!this.isOpen) { this.isOpen = true } },
    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },
  computed: {
    filesAreInput () { return this.selectedFiles.length > 0 },
    selectedFileNames () { return this.selectedFiles.map( file => file.name ) },
  }
}
</script>

<style lang="scss">
$linkColor: #009fff;

.pretty-input-upload {
	position: relative;
	cursor: pointer;

	border: 0.8px solid #009fff;
	border-radius: 5px;
	color: $linkColor;
	background: rgba(0, 0, 0, 0);
	padding: 4px 9px;

	display: flex;
	align-items: center;

	p {
		font-size: 13px;
    color: $linkColor;
    font-weight: 400;
	}

  &:hover {
    background-color: $linkColor;
    p {
      color: white;
    }
  }
}

.input-file {
	opacity: 0;
	cursor: pointer;
	position: absolute;
	width: 100%;
	left: 0;
}

.arrow-symbol {
  font-size: 28px;
}

.fa-sort-up {
  position: relative;
  top: 16px;

  &:hover {
    cursor: pointer;
  }
}

</style>
