<template>
  <div class="error-message" 
       :style="outsideStyle"
       v-if="!hasBeenClosed"
       id="responseMessageContainer">
    <p class="no-margin-top">{{message}}</p>
    <div @click="closeMessage" v-if="!preventClose" class="close-container">
      <CloseIcon title="Close"/>
    </div>
  </div>
</template>

<script>
import scrollIntoView from 'scroll-into-view-if-needed'
import CloseIcon from 'vue-material-design-icons/CloseCircle.vue'

export default {
  components: {
    CloseIcon,
  },

  props: {
    'message': String,
    'preventClose': Boolean,
    'outsideStyle': String,
  },

  data: function () {
    return {
      hasBeenClosed: false,
    }
  },

  methods: {
    closeMessage () {
      this.hasBeenClosed = true
    },

    scrollMessageIntoView () {
      this.$nextTick(() => scrollIntoView(document.getElementById('responseMessageContainer'), {behavior: 'smooth', scrollMode: 'if-needed', block: 'nearest'}))
    }
  },

  watch: {
    message: function (newVal) {
      if (newVal) {
        this.scrollMessageIntoView()
      }
    }
  }
}
</script>

<style lang="scss">
.error-message, .success-message, .info-message {
  display: flex; 
  flex-direction: row;
  padding: 12px 20px;
  color: white !important;
  p {
    color: white;
  }
  margin-left: auto;
  margin-right: auto;
  width: fit-content;

  p, span {
    font-weight: 600;
  }
  
  .close-container {
    display: flex;
    margin-left: 6px;
    margin-right: -3px;
    margin-bottom: -1px;
    color: white;

    &:hover {
      cursor: pointer;
    }

    svg {
      bottom: 0;
    }
  }
}

.error-message {
  background-color: rgb(228, 94, 94);
}
</style>