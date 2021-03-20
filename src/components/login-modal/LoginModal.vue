<template>
  <div id="modalAndBackdropWrapper">
    <span class="modal-backdrop" @click="closeModal()"></span>
    <div class="loginModal">
      <Login v-if="$store.getters.loginModalContext==='login'" :closeModal="closeModal"/>

      <Signup v-if="$store.getters.loginModalContext==='register'" :closeModal="closeModal"/>

      <ForgotPassword v-if="$store.getters.loginModalContext==='forgot-password'"/>

      <button class="y-button-close" @click="closeModal()" style="position: absolute; right: 8px; top: 16px;">
        <CrossIcon title="" :size="40"/>
      </button>
    </div>
  </div>
</template>

<script>
import CrossIcon from 'vue-material-design-icons/Close.vue'
import ForgotPassword from './ForgotPassword.vue'
import Login from './Login.vue'
import Signup from './Signup.vue'

export default {
  name: 'login-modal',

  components: {
    CrossIcon,
    ForgotPassword, Login, Signup,
  },

  data: function () {
    return {
    }
  },

  methods: {
    setModalContext (modalContext) {
      this.$store.commit('setLoginModalContext', modalContext)
      this.emptyInputFields()
      this.clearErrorMessages()
    },

    emptyInputFields () {
      this.loginUsername = ''
      this.loginPassword = ''
      this.signupUsername = ''
      this.signupPassword = ''
      this.signupPassword2 = ''
    },

    clearErrorMessages () {
      this.signupErrorMessage = ''
    },

    closeModal () {
      this.$store.commit('setLoginModalVisibility', false)
      this.$store.commit('setLoginModalContext', 'login')
      this.setModalContext('login')
    },
  },
  computed: {
    usernameValidity () {
      let validUsernamePattern = /^[a-zA-Z][\w\d_-]{1,19}$/
      if ( this.signupUsername.length === 0 ) { return undefined }
      else { return validUsernamePattern.test( this.signupUsername ) }
    },
    passwordValidity () {
      if ( this.signupPassword.length === 0 ) { return undefined }
      else { return this.signupPassword.length >= 6 }
    },
    passwordValidity2 () {
      if ( this.signupPassword2.length === 0 ) { return undefined }
      else { return this.signupPassword2.length >= 6 && this.signupPassword2 === this.signupPassword }
    },
  },
  mounted () {
  }
}
</script>


<style lang="scss">
.modal-backdrop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 5;
  &:hover {
    cursor: pointer;
  }
}

.login-modal-inner-wrapper {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  input {
    width: 220px;
  }
}

.loginModal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 6;
  transform: translateX(-50%) translateY(-50%);
  display: flex;
  justify-content: center;
  padding: 40px 180px;
  background-color: white;
  box-shadow: rgba(0,0,0,0.3) 0px 5px 28px 3px;

  @media (max-width: 900px) {
    padding: 40px 0px;
    width: 100%;
  }

  .underline-link {
    &:hover {
      cursor: pointer;
    }
  }
}
.loginModal:before {
  height: 10px;
  width: 100%;

  position: absolute;
  content: "";
  background: linear-gradient(to right, $themeGreen1, $themeGreen2);
  top: -3px;
}

.login-register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  min-width: 12rem;
}

.login-button {
  padding: 6px 30px;
  align-self: center;
  margin-bottom: 32px;
}

.dark {
  .loginModal {
    background-color: $themeDark3;
    color: white;
    input {
      color: #ccc;
      background-color: transparent;
      border-top: none;
      border-left: none;
      border-right: none;
    }
    label {
      color: #ccc;
    }
  }
  
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.85);
  }
}
</style>
