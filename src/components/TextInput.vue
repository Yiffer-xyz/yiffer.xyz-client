<template>
  <div class="customTextInput" :style="wrapperStyle">
    <p v-if="title" class="titleText">
      {{ title }}
    </p>

    <div class="positionRelative innerInputWrapper">
      <span v-if="startIcon" class="inputIconWrapper inputIconWrapperLeft">
        <SearchIcon title=""/>
      </span>
      <input v-model="localValue"
             @input="changeEvent => $emit('change', changeEvent.target.value)"
             type="text"
             :placeholder="placeholder"
             class="paddedInput"
             :class="{
               inputWithIcon: startIcon,
               borderTheme1: borderTheme1,
               borderTheme2: borderTheme2
             }"
             @focus="$emit('focus')"
             @blur="$emit('blur')"
             @click="$emit('click')"/>
      <span v-if="includeClearButton" class="inputIconWrapper inputIconWrapperRight cursorPointer"
            v-show="localValue"
            @click="clear">
        <CrossIcon title="Clear"/>
      </span>
    </div>
  </div>
</template>

<script>
import SearchIcon from 'vue-material-design-icons/Magnify.vue'
import CrossIcon from 'vue-material-design-icons/Close.vue'

export default {
  components: {
    SearchIcon, CrossIcon,
  },

  props: {
    value: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    startIcon: {
      type: Boolean,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    includeClearButton: {
      type: Boolean,
      required: false,
    },
    borderTheme1: {
      type: Boolean,
      required: false,
    },
    borderTheme2: {
      type: Boolean,
      required: false,
    },
    wrapperStyle: {
      type: String,
      required: false,
    }
  },

  data: function () {
    return {
      localValue: this.value,
    }
  },

  watch: {
    value (newValue) {
      this.localValue = newValue
    },
  },

  methods: {
    clear () {
      this.localValue = ''
      this.$emit('change', '')
    },
  },
}
</script>

<style lang="scss" scoped>
$darkThemeColor: #eee;
$paddingBig: 0.75rem;
$paddingSmall: 0.4rem;

::placeholder {
  color: #aaa;
}

.titleText {
  position: absolute;
  font-size: 0.75rem;
  top: 0;
  left: $paddingBig;
  @media (max-width: 900px) {
    left: $paddingSmall;
  }
}

.customTextInput {
  position: relative;
}

.innerInputWrapper {
  margin-top: 0.9rem;
  @media (max-width: 900px) {
    margin-top: 1rem;
  }
}

.inputIconWrapper {
  color: $themeDark1;
  position: absolute;
  display: block;
  top: 0.5rem;
}

.inputIconWrapperRight {
  right: $paddingBig;
  @media (max-width: 900px) {
    right: $paddingSmall;
  }
  &:hover {
    color: $themeBlueDark;
  }
}

.inputIconWrapperLeft {
  left: $paddingBig;
  @media (max-width: 900px) {
    left: $paddingSmall;
  }
}

.paddedInput {
  text-align: left;
  box-sizing: border-box;
  padding: 9px;
  text-align: center;
  background: transparent;
  outline: none;
  color: #333;
  width: 100%;
  border: none;
  border-image: linear-gradient(to right, $themeGreen1, $themeGreen2) 1; 
  border-bottom-style: solid;
  border-bottom-width: 2px;
}

.borderTheme1 {
  border-image: none;
  border-color: $themeGreen1;
}
.borderTheme2 {
  border-image: none;
  border-color: $themeGreen2;
}

.inputWithIcon {
  text-align: center;
}

.dark {
  .paddedInput, .inputIconWrapper {
    color: $darkThemeColor;
  }
}

</style>