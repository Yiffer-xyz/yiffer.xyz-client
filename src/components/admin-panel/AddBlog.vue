<template>
  <div class="admin-content-box" @click="openComponent" :class="{'admin-content-box-open': isOpen}">
    <h2 @click="closeComponent" class="cursor-pointer">Add blog</h2>
    <span class="admin-content-box-inner" v-if="isOpen">

      <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"
                        class="m-8"/>

      <table id="newBlogTable">
        <tr>
          <td>
            <p>Title</p>
          </td>
          <td>
            <input type="text" v-model="title" />
          </td>
        </tr>
          
        <tr>
          <td>
            <p>Importance</p>
          </td>
          <td>
            <input type="number" v-model="importance" />
          </td>
        </tr>

        <tr>
          <td>
            <p>Display days</p>
          </td>
          <td>
            <input type="number" v-model="displayDays" />
          </td>
        </tr>
      </table>

      <p class="mt-16">Blog content:</p>
      <textarea v-model="content" rows="6" style="width: 80%;"/>

      <div v-show="content" class="mt-16">
        <p>Preview:</p>
        <p style="text-align: left;" v-html="content"/>

        <button @click="submitNewBlog" class="y-button mt-16">
          Submit
        </button>
      </div>

      <menu-up-icon @click.native="closeComponent" class="mdi-arrow close-component-arrow"/>
    </span>

    <span v-else>
      <menu-down-icon class="mdi-arrow"/>
    </span>
  </div>
</template>

<script>
import blogApi from '../../api/blogApi'

import ResponseMessage from '@/components/ResponseMessage.vue'

export default {
  name: 'addBlog',

  components: { ResponseMessage },
  
  data: function () {
    return {
      isOpen: false,
      title: '',
      importance: 0,
      displayDays: 0,
      content: '',
      responseMessage: '',
      responseMessageType: 'info',
    }
  },

  methods: {
    async submitNewBlog () {
      let response = await blogApi.addBlog(this.title, this.importance, this.content, this.displayDays)

      if (response.success) {
        this.responseMessage = 'Successfully added blog!'
        this.responseMessageType = 'success'
        this.clearContent()
      }
      else {
        this.responseMessage = 'Error: ' + response.message
        this.responseMessageType = 'error'
      }
    },

    clearContent () {
      this.title = ''
      this.importance = 0
      this.displayDays = 0
      this.content = ''
    },

    closeResponseMessage () { this.responseMessage = '' },

    openComponent () { if (!this.isOpen) { setTimeout( () => this.isOpen = true, 15 ) } },

    closeComponent () { setTimeout( () => this.isOpen = false, 15 ) }
  },
}
</script>

<style lang="scss">
#newBlogTable {
  td {
    text-align: left;
  }
  input[type="text"] {
    width: 12rem;
  }
  input[type="number"] {
    width: 2.5rem;
  }
}
</style>