<template>
  <div class="custom-select" :tabindex="tabindex" @blur="isOpen = false">
    <p v-if="title" class="titleText">
      {{ title }}
    </p>
    <div class="selected"
         :style="{'border-color': overrideBorderColor}"
         :class="{
           open: isOpen,
           overrideBorderColor: (overrideBorderColor || borderTheme1 || borderTheme2),
           borderTheme1: borderTheme1,
           borderTheme2: borderTheme2
         }"
         @click="isOpen = !isOpen">
      {{ selected.text }}
    </div>
    <div class="items" :class="{ selectHide: !isOpen }">
      <div
        v-for="option of options"
        :key="option.value"
        @click="
          selected = option
          isOpen = false
          $emit('change', option.value)
        "
      >
        {{ option.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    options: {
      type: Array,
      required: true,
    },
    overrideBorderColor: {
      type: String,
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
    default: {
      type: String,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  mounted() {
    this.$emit("input", this.selected)
  },

  data() {
    return {
      selected: this.default
        ? this.default
        : this.options.length > 0
        ? this.options[0]
        : null,
      isOpen: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../scss/shadows.scss";
$height: 2.25rem;
$padding: 0.75rem;
$borderRadius: 0px;

$lightThemeColor: #333;
$darkThemeColor: #eee;

.titleText {
  position: absolute;
  font-size: 0.75rem;
  left: 0.75rem;
  top: 0;
}

.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: $height;
  line-height: $height;
  padding-top: 0.75rem;
}

.custom-select .selected {
  border-radius: $borderRadius;
  color: $lightThemeColor;
  padding-left: $padding;
  cursor: pointer;
  user-select: none;
  border-image: linear-gradient(to right, $themeGreen1, $themeGreen2) 1; 
  border-width: 2px;
  border-bottom-style: solid;
}

.custom-select .selected.open {
  border-radius: $borderRadius $borderRadius 0px 0px;
}

.custom-select .selected:after {
  position: absolute;
  content: "";
  bottom: 0.65rem;
  right: $padding;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-color: $lightThemeColor transparent transparent transparent;
}

.custom-select .items {
  color: $lightThemeColor;
  border-radius: 0px 0px $borderRadius $borderRadius;
  overflow: hidden;
  @include simpleshadowNoHover;

  position: absolute;
  background-color: white;
  left: 0;
  right: 0;
  z-index: 1;
}

.custom-select .items div {
  color: $lightThemeColor;
  padding-left: $padding;
  cursor: pointer;
  user-select: none;
}

.custom-select .items div:hover {
  background: linear-gradient(left, $themeGreen1, $themeGreen2);
}

.selectHide {
  display: none;
}

.overrideBorderColor {
  border-image: none !important;
}
.borderTheme1 {
  border-color: $themeGreen1;
}
.borderTheme2 {
  border-color: $themeGreen2;
}

.dark {
  .custom-select .selected,
  .custom-select .items,
  .custom-select .items div {
    color: $darkThemeColor;
  }

  .custom-select .selected:after {
    border-color: $darkThemeColor transparent transparent transparent;
  }

  .custom-select .items {
    background-color: $themeDark1;
  }

  .custom-select .items div:hover {
    color: #333;
  }
}
</style>
