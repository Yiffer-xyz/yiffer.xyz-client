<template>
  <div id="modalAndBackdropWrapper">
    <span class="modal-backdrop" @click="closeModal()"></span>
    <div class="loginModal">

      <div v-if="$store.getters.loginModalContext==='login'" class="login-modal-inner-wrapper">
        <p class="modal-header">Log in</p>

        <ResponseMessage :message="loginErrorMessage"
                         :messageType="'error'"
                         @closeMessage="() => loginErrorMessage = ''"
                         style="margin-top: 1rem;"/>

        <form @submit="loginConfirmClicked" class="login-register-form">
          <label for="loginUsername">Username</label>
          <input v-model="loginUsername" ref="loginUsernameInput" name="loginUsername" type="text" class="loginInput"/>

          <label for="loginPassword">Password</label>
          <input v-model="loginPassword" name="loginPassword" type="password" class="loginInput"/>

          <button v-if="!loginLoading" type="submit" class="y-button login-button">Log in</button>
          <button v-if="loginLoading" class="y-button y-button-neutral login-button pleasewait-button">Please wait...</button>
        </form>

        <button @click="setModalContext('register')" class="margin-top-4 underline-link link-color text-button"
          >Click here to <b>sign up</b></button>
      </div>


      <div v-if="$store.getters.loginModalContext==='register'" class="login-modal-inner-wrapper">
        <p class="modal-header">Sign up</p>

        <ResponseMessage :message="signupErrorMessage"
                         :messageType="'error'"
                         @closeMessage="() => signupErrorMessage = ''"
                         outsideStyle="margin-top: 1rem;"/>

        <form @submit="signupConfirmClicked" class="login-register-form">
          <label for="signupUsername">Username</label>
          <input
            v-model="signupUsername"
            ref="signupUsernameInput"
            class="loginInput"
            name="signupUsername"
            type="text"
          />

          <label for="signupPassword">Password</label>
          <input
            v-model="signupPassword"
            class="loginInput"
            name="signupPassword"
            type="password"
          />

          <label for="signupPassword2">Repeat password</label>
          <input
            v-model="signupPassword2"
            class="loginInput"
            name="signupPassword2"
            type="password"
          />

          <button v-if="!signupLoading" type="submit" class="y-button login-button">Sign up</button>
          <button v-if="signupLoading" class="y-button login-button pleasewait-button">Please wait...</button>
        </form>

        <button @click="setModalContext('login')" class="margin-top-4 underline-link link-color text-button"
          >Click here to <b>log in</b></button>
      </div>

      <button class="y-button-close" @click="closeModal()" style="  position: absolute; right: 8px; top: 16px;"
        ><CrossIcon title="" :size="40"/></button>
    </div>
  </div>
</template>

<script>
import CheckboxIcon from 'vue-material-design-icons/CheckboxMarkedCircle.vue'
import CrossIcon from 'vue-material-design-icons/Close.vue'
import ResponseMessage from '@/components/ResponseMessage.vue'

import authApi from '../api/authApi'

export default {
  name: 'login-modal',

  components: {
    CheckboxIcon,
    CrossIcon,
    ResponseMessage,
  },

  data: function () {
    return {
      loginUsername: '',
      loginPassword: '',
      loginErrorMessage: '',
      loginLoading: false,

      signupUsername: '',
      signupPassword: '',
      signupPassword2: '',
      signupErrorMessage: '',
      signupLoading: false,
    }
  },

  methods: {
    setModalContext ( modalContext ) {
      this.$store.commit('setLoginModalContext', modalContext)
      this.emptyInputFields()
      this.clearErrorMessages()
    },

    async loginConfirmClicked ( buttonEvent ) {
      buttonEvent.preventDefault()
      this.loginLoading = true
      let loginData = {username: this.loginUsername, password: this.loginPassword}
      let response = await this.$store.dispatch('login', loginData)
      this.loginLoading = false
      if ( response.success ) {
        this.closeModal()
      }
      else {
        this.emptyInputFields()
        this.loginErrorMessage = response.message
      }
    },

    async signupConfirmClicked ( buttonEvent ) {
      buttonEvent.preventDefault()
      this.signupLoading = true
      let signupData = {username: this.signupUsername, password: this.signupPassword, password2: this.signupPassword2}
      let response = await this.$store.dispatch('signup', signupData)
      this.signupLoading = false
      if ( response.success ) {
        this.closeModal()
      }
      else {
        this.emptyInputFields()
        this.signupErrorMessage = response.message
      }
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
      this.loginErrorMessage = ''
    },

    closeModal () {
      this.$store.commit('setLoginModalVisibility', false)
      this.$store.commit('setLoginModalContext', 'login')
      this.setModalContext('login')
    },

    mockLoginError () {
      return { success: false, message: 'User does not exist' }
    },
    mockLoginSuccess () {
      return { success: true, userData: {username: 'tullebruker22', donator: false, userType: 'normal'} }
    },
    mockSignupError () {
      return { success: false, message: 'Password is too short' }
    },
    mockSignupSuccess () {
      return { success: true, userData: {username: 'tullebruker22', donator: true, userType: 'admin'} }
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
    this.$store.watch(this.$store.getters.getLoginModalVisibility, (visibility) => {
      if (visibility) {
        if (this.$store.getters.loginModalContext==='login') {
          this.$refs.loginUsernameInput.focus()
        }
        else {
          this.$refs.signupUsernameInput.focus()
        }
      }
    })
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
  width: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    font-size: 14px;
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
  background: linear-gradient(to right, $theme2, $theme6);
  top: -3px;
}

.login-register-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 15px;
  label {
    font-size: 14px;
    color: #555;
  }
  input {
    outline: none;
    margin-bottom: 17px;
    margin-top: 3px;
    border: 0.5px solid #555;
    border-color: transparent transparent #555 transparent;
    color: #333;
    background: transparent;
    padding: 6px 4px;
  }

  .invalid-input {
    border: 2px solid #ec2f4b !important; //todo
    padding: 4.5px 2.5px;
  }
  .valid-input {
    border: 2px solid $theme5 !important; //todo works? rett farge ??
    padding: 4.5px 2.5px;
  }
}

.register-button {
  font-size: 14px;
  font-weight: 300;
  margin-top: 10px;
}

.login-button {
  padding: 6px 30px;
  align-self: center;
  margin-bottom: 32px;
}

.modal-input-explanation {
  font-size: 12px;
  margin-bottom: 16px;
}

.modal-error-message {
  margin-top: 1rem;
  color: $themeRed1 !important;
  font-weight: 400;
}

.pleasewait-button {
  background-color: $theme5;
  color: white;
  cursor: pointer;
  &:hover {
    cursor: default !important;
  }
}

.dark {
  .loginModal {
    background-color: $themeBlue0p5;
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
    .loginInput {
      background: rgba(255, 255, 255, 0.075);
      border: none;
      border-bottom: 1px solid #ddd;;
    }
  }
  
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.7);
  }
}
</style>

<style>
  @media (max-width: 795px) {
  }
</style>
