<template>
  <div>
    <router-link :to="paidImage.link" class="comic-card-link" style="height: 100%;">
      <p class="comic-card-comic-title">
        {{paidImage.mainText}}
      </p>

      <p class="mt-8" style="padding: 0 4px;">
        {{paidImage.secondaryText}}
      </p>
    </router-link>
  </div>
</template>

<script>
import keywordApi from '../api/keywordApi'

import VotingButton from '@/components/VotingButton.vue'
import VotingButtonSingleColor from '@/components/VotingButtonSingleColor.vue'
import PagesIcon from 'vue-material-design-icons/FileOutline.vue'
import UserIcon from 'vue-material-design-icons/AccountOutline.vue'
import UsersIcon from 'vue-material-design-icons/AccountMultipleOutline.vue'
import PlusIcon from 'vue-material-design-icons/Plus.vue'
import RefreshIcon from 'vue-material-design-icons/Refresh.vue'
import Tags from 'vue-material-design-icons/TagMultiple.vue'
import HideTags from 'vue-material-design-icons/TagRemove.vue'

export default {
  name: 'comic-card-paid-image',
  
  components: {
  },

  props: {
    paidImage: Object,
  },

  data: function () {
    return {
    }
  },

  methods: {
  },
}
</script>

<style lang="scss">
@import "../scss/colors.scss";
.triangle-wrapper {
  position: absolute; top: 0;
}
.triangle-wrapper-left {
  left: 0;
  .triangle-inner {
    border-width: 60px 60px 0 0;
    border-color: $themeGray0p5 transparent transparent transparent;
    .triangle-label {
      color: $theme5;
      position: absolute;
      top: 10px;
      transform: rotate(-45deg);
      left: 2px;
      font-weight: 400;
    }
  }
}
.triangle-wrapper-right {
  right: 0;
  .triangle-inner {
    border-width: 0 60px 60px 0;
    border-color: transparent $themeGray0p5 transparent transparent;
    .triangle-label {
      position: absolute;
      color: $themeDark1;
      top: 10px;
      right: 5px;
      font-weight: 400;
      transform: rotate(45deg);
    }
    .triangle-label-cancelled {
      right: 3px;
      top: 11px;
      font-size: 15px;
    }
  }
}
.triangle-inner {
  width: 0;
  height: 0;
  border-style: solid;
  .triangle-label {
    cursor: pointer;
  }
}

.emphasized-keyword {
  font-size: 12px;
  border: 0.5px solid #a6a6a6;
  margin: 1px 3px;
  padding: 0.5px 6px 1px 6px;
  border-radius: 10px;
  background: $themeGray5;
  color: white !important;
  font-weight: bold !important;
  &:hover {
    cursor: default;
  }
}

@media (max-width: 900px) {
  .triangle-wrapper-left {
    .triangle-inner {
      border-width: 40px 40px 0 0;
      .triangle-label {
        font-size: 10px;
        top: 7px;
        left: 2px;
      }
    }
  }

  .triangle-wrapper-right {
    .triangle-inner {
      border-width: 0 40px 40px 0;
      .triangle-label {
        font-size: 10px;
        top: 8px;
        right: 3px;
      }
      .triangle-label-cancelled {
        right: 1px;
      }
    }
  }
}

.comic-card-link {
  width: 100%;
  p {
    word-wrap: break-word;
  }
}

.circled-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 33px;
  width: 33px;
  border-radius: 35px;
  font-size: 12px;
  font-weight: 400;
  margin: 3px 0;
  color: #444 !important;
  background-color: $themeGray2;

  &:hover {
    cursor: default;
  }
}

.circled-text-autowidth {
  min-width: 33px;
  width: auto;
}

.circled-text-red {
  border: 0.5px solid $theme5;
}

.dark {
  .circled-text {
    background-color: #333;
    color: #bbb !important; //todo
  }

  .emphasized-keyword {
    background: $themeGray8;
    border-color: $themeGray8;
  }

  .triangle-wrapper-right {
    .triangle-inner {
      border-color: transparent $themeDark3 transparent transparent;
      .triangle-label {
        color: inherit;
      }
    }
  }
  .triangle-wrapper-left {
    .triangle-inner {
      border-color: $themeDark3 transparent transparent transparent;
    }
  }
}

.comic-card {
  position: relative;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2px;
  margin: 10px;
  padding-bottom: 8px;
  background-color: $themeGray0p5;
  img {
    width: 100%;
    height: 283px;
  }
  a {
    text-decoration: none;
  }
  p, div {
    color: $cardTextColorLight;
  }
  .comic-card-inner-container {
    display: flex; flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    justify-content: space-between;
  }
  .horiz-card-row {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 90%;
    p:hover {
      cursor: default;
    }
  }
  .comic-card-comic-title {
    font-weight: 600;
    margin: 0px 10px;
    text-align: center;
    color: $cardTextColorLight;
  }
  .voting-button {
    margin-top: 4px;
  }

  @media (max-width: 900px) {
    width: 100px;
    margin: 6px;
    font-size: 14px;
    .comic-card-comic-title {
      font-size: 15px;
      margin: 0px 2px;
    }
    img {
      height: 141px;
    }
    .voting-button {
      width: 76%;
    }
  }
}

.keyword-container {
  margin-top: 7px;
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: center;
}
</style>
