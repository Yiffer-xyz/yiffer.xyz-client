<template>
  <div :class="{'error-message': messageType==='error', 'success-message': messageType==='success', 'info-message': messageType==='info'}" 
       v-show="message && message.length > 0"
       id="responseMessageContainer">
    <p>{{message}}</p>
    <div @click="closeMessage()" v-if="!preventClose" class="close-container">
      <CloseIcon title="Close"/>
    </div>
  </div>
</template>

<script>
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

    scrollIntoView () {
      this.$nextTick(() => document.getElementById('responseMessageContainer').scrollIntoView({behavior: 'smooth'}))
    }
  },

  watch: {
    message: function (newVal, oldVal) {
      if (newVal) {
        this.scrollIntoView()
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