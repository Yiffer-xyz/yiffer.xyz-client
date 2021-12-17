<template>
  <div class="verticalFlex">
    <div class="horizontalFlex flexWrap justifyStart"
         v-if="!disableUpload && !isReadyForCrop"
         style="gap: 8px;">
      <form enctype="multipart/form-data"
            v-if="!croppieRef"
            novalidate
            style="width: fit-content;"
            :disabled="isDisabled">
        <div class="pretty-input-upload" style="width: 16rem"
             :class="{'y-button-disabled': isDisabled}">
          <input type="file" multiple="false" @change="onFileAdded" id="newPageFiles"
                 accept="image/png,image/jpeg" class="input-file" style="width: 16rem"
                 :disabled="isDisabled"/>
          <p>
            {{buttonText}}
          </p>
        </div>
      </form>

      <button class="y-button y-button-neutral" @click="$emit('cancel')" style="height: fit-content;">
        Cancel
      </button>
    </div>

    <button class="y-button m-4 width100"
            style="width: 16.25rem"
            :class="{'y-button-disabled': isDisabled}"
            @click="$emit('disabledUploadClick')"
            v-else-if="!isReadyForCrop"
            :disabled="isDisabled">
      {{buttonText}}
    </button>

    <div class="verticalFlex alignItemsStart" :style="{'max-height: 0px': !isReadyForCrop}">
      <vue-croppie ref="croppieRef"
                   customClass="croppie"
                   v-show="isReadyForCrop"
                   :enableResize="false"
                   :boundary="{ width: 300, height: 300, type: 'circle' }"
                   :viewport="{ width: 250, height: 250, type: 'circle' }">
      </vue-croppie>

      <ResponseMessage :message="cropErrorText"
                       messageType="error"
                       @closeMessage="() => cropErrorText = ''"
                       style="margin: 0.5rem 0 1.5rem 0"/>

      <div class="horizontalFlex">
        <button v-if="isReadyForCrop" @click="$emit('cancel')" class="y-button y-button-neutral mr-8">
          Cancel
        </button>

        <LoadingButton v-if="isReadyForCrop"
                       @click="crop"
                       :isLoading="isSubmitting"
                       text="Submit"
                       iconType="check"
                       class="y-button iconButton"/>
      </div>
    </div>
  </div>
</template>

<script>
import ImageTools from '@/utils/imageResizer'
const imageResizer = new ImageTools();
import ResponseMessage from '@/components/ResponseMessage.vue'
import LoadingButton from '@/components/LoadingButton.vue'

export default {
  props: {
    buttonText: String,
    externalFile: File,
    disableUpload: Boolean,
    isDisabled: Boolean,
    isSubmitting: Boolean,
  },

  components: {
    ResponseMessage, LoadingButton,
  },

  data() {
    return {
      croppieImage: '',
      croppedImageB64: null,
      isReadyForCrop: false,
      cropErrorText: null,
      croppieRef: '',
    };
  },

  methods: {
    onFileAdded (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) { return }
      
      let reader = this.makeFileReader()
      reader.readAsDataURL(files[0])
    },

    loadExternalFile () {
      if (!this.externalFile) { return }
      let reader = this.makeFileReader()
      reader.readAsDataURL(this.externalFile)
    },

    makeFileReader () {
      this.cropErrorText = null
      this.croppedImageB64 = null
      this.$emit('imageReady', false)

      var reader = new FileReader()
      reader.onload = e => {
        this.$refs.croppieRef.bind({
          url: e.target.result,
          zoom: 0,
          showZoomer: false
        })

        this.$emit('readyForCrop', true)
        this.isReadyForCrop = true
      }

      return reader
    },

    async crop () {
      let options = {
        type: 'base64',
        size: 'original',
        format: 'jpeg',
        quality: 1,
      }

      this.cropErrorText = null
      this.croppedImageB64 = null

      this.$refs.croppieRef.result(options, async output => {

        try {
          const resized = await imageResizer.ResizeImage(output, 200, 283)
          this.croppedImageB64 = resized
          this.$emit('imageReady', true)
          let croppedFile = await urlToFile(resized, 'test.jpg', 'image/jpeg')
          this.$emit('handleImage', {file: croppedFile, base64: resized})
        }
        catch (err) {
          this.cropErrorText = err
          this.$emot('cropError', err)
          this.$emit('imageReady', false)
        }
      })
    },
  },

  watch: {
    externalFile () {
      this.loadExternalFile()
    }
  }
}

async function urlToFile(url, filename, mimeType){
  let res = await fetch(url)
  let buffer = await res.arrayBuffer()
  return new File([buffer], filename, {type: mimeType})
}
</script>

<style lang="scss" scoped>
.croppie {
  width: fit-content;
}
</style>