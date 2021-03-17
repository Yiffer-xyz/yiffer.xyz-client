<template>
  <div :class="`customTextInput ${classes}`" :style="wrapperStyle">
    <p v-if="title" class="titleText">
      {{ title }}
    </p>

    <div class="positionRelative innerInputWrapper">
      <span v-if="startIconVariant" class="inputIconWrapper inputIconWrapperLeft">
        <SearchIcon title="" v-if="startIconVariant === 'search'"/>
        <TagsIcon title="" v-if="startIconVariant === 'tags'"/>
      </span>
      <input v-model="localValue"
             @input="changeEvent => $emit('change', changeEvent.target.value)"
             :type="type"
             :placeholder="placeholder"
             class="paddedInput"
             :class="{
               inputWithIcon: startIconVariant,
               borderTheme1: borderTheme1,
               borderTheme2: borderTheme2
             }"
             :style="`text-align: ${textAlign}`"
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
import TagsIcon from 'vue-material-design-icons/TagMultiple.vue'

export default {
  components: {
    SearchIcon, CrossIcon, TagsIcon,
  },

  props: {
    value: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    textAlign: {
      type: String,
      required: false,
      default: 'center'
    },
    startIconVariant: {
      type: String,
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
    },
    classes: {
      type: String,
      required: false,
    },
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
      this.$emit('clear')
    },
  },
}
</script>

<style lang="scss" scoped>
$darkThemeColor: #eee;
$paddingBig: 0.5rem;
$paddingSmall: 0.4rem;

::placeholder {
  color: #aaa;
}

.titleText {
  position: absolute;
  font-size: 0.85rem;
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
  padding: 9px $paddingBig;
  text-align: center;
  background: transparent;
  outline: none;
  color: #333;
  width: 100%;
  border: none;
  border-image: linear-gradient(to right, $themeGreen1, $themeGreen2) 1; 
  border-bottom-style: solid;
  border-bottom-width: 2px;
  @media (max-width: 900px) {
    padding: 9px $paddingSmall;
  }
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