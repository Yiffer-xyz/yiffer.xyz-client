<template>
  <div :class="{'error-message': messageType==='error', 'success-message': messageType==='success', 'info-message': messageType==='info'}" 
       v-show="message && message.length > 0"
       id="responseMessageContainer">
    <p class="no-margin-top">{{message}}</p>
    <div @click="closeMessage()" v-if="!preventClose" class="close-container">
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
    'messageType': String,
    'preventClose': Boolean,
  },

  data: function () {
    return {
    }
  },

  methods: {
    closeMessage () {
      this.$emit('closeMessage')
    },

    scrollMessageIntoView () {
      this.$nextTick(() => scrollIntoView(document.getElementById('responseMessageContainer'), {behavior: 'smooth', scrollMode: 'if-needed', block: 'nearest'}))
    }
  },

  watch: {
    message: function (newVal, oldVal) {
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
.success-message {
  background-color: rgb(50, 133, 47);
}
.info-message {
  background-color: rgb(45, 101, 175);
}
</style>