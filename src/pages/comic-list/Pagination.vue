<template>
  <div class="paginationContainer">
    <div v-if="!isLoading || showWhileLoading"
         class="upperBodyPagination simpleShadowNoHover"
         id="upperPaginationButtons">
      <div @click="paginate('down', scrollToTop, true)"
           class="paginationButton paginationButton2 paginateLeft"
           :class="{'disabledPagination': pageNumber===1}">
        <LeftArrow/>
      </div>

      <div v-for="(pageNo, index) in paginationButtons"
          :key="index"
          :class="{'buttonSelected': pageNumber===pageNo, 'dot-dot-dot-button': pageNo==='...'}"
          class="paginationButton paginationButton2"
          @click="paginate(pageNo, scrollToTop, true)">
        {{pageNo}}
      </div>

      <div @click="paginate('up', scrollToTop, true)"
           class="paginationButton paginationButton2 paginateRight"
           :class="{'disabledPagination': isOnLastPage}">
        <RightArrow/>
      </div>
    </div>
    <div v-else-if="!shouldHide"
         style="margin-top: -3px; width: 30rem;">
      <SkeletonTheme :color="isDarkTheme ? '#383f45' : 'rgba(238,238,238,0.75)'"
                     :highlight="isDarkTheme ? '#525456' : '#fbfbfb'">
        <Skeleton height="35px" width="100%"/>
      </SkeletonTheme>
    </div>
  </div>
</template>

<script>
import { Skeleton, SkeletonTheme } from 'vue-loading-skeleton'
import { mapGetters } from 'vuex'
import LeftArrow from 'vue-material-design-icons/ArrowLeft.vue'
import RightArrow from 'vue-material-design-icons/ArrowRight.vue'

export default {
  components: {
    Skeleton, SkeletonTheme,
    LeftArrow, RightArrow,
  },

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    shouldHide: {
      type: Boolean,
      required: false,
    },
    showWhileLoading: {
      type: Boolean,
      required: true,
    },
    onPaginate: {
      type: Function,
      required: true,
    },
    scrollToTop: {
      type: Boolean,
      required: false,
      default: false,
    }
  },

  computed: {
    ...mapGetters([
      'paginatedComics',
      'pageNumber',
      'isDarkTheme',
    ]),

    paginationButtons () {
      if (!this.paginatedComics.fetched || this.paginatedComics.failed) {
        if (this.showWhileLoading) {
          return this.previousPaginationButtons
        }
        else {
          return []
        }
      }

      let currentPage = this.paginatedComics.payload.page
      let pages = this.paginatedComics.payload.numberOfPages

      let buttonList = []
      if (pages <= 9) {
        for (var i = 1; i < pages+1; i++) { buttonList.push(i) }
        return buttonList
      }
      if (currentPage <= 5) {
        return [1, 2, 3, 4, 5, 6, 7, '...', pages]
      }
      if (currentPage >= pages-4) {
        return [1, '...', pages-6, pages-5, pages-4, pages-3, pages-2, pages-1, pages]
      }
      else {
        return [1, '...', currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2, '...', pages]
      }
    },

    isOnLastPage () {
      let currentPage = this.paginatedComics.payload.page
      return currentPage === this.paginationButtons[this.paginationButtons.length-1]
    },
  },

  data: function () {
    return {
      previousPaginationButtons: [],
    }
  },

  methods: {
    paginate (pageNumber, shouldScrollToTopOfList, showPaginationWhileLoading) {
      this.previousPaginationButtons = [...this.paginationButtons]
      this.onPaginate(pageNumber, shouldScrollToTopOfList, showPaginationWhileLoading)
    }
  },
}
</script>

<style lang="scss" scoped>
.buttonSelected {
  border-width: 0;
  border-style: hidden;
  border-bottom-width: 6px;
  border-bottom-style: solid;
  border-image: linear-gradient(to right, $themeGreen1, $themeGreen2) 1;
  padding-bottom: 3px !important;
  font-weight: 400;
}

.paginationContainer {
  width: 100%;
  display: flex;
  justify-content: center;
}
.paginationButton {
  flex: 1;
  font-weight: 400;
  font-size: 14px;
  background: $filterPaginationLightMain;
  padding: 9px 10px;
  @media (max-width: 340px) {
    padding: 9px 6px;
  }
  &:hover {
    &:not(.disabledPagination) {
      cursor: pointer;
      &:not(.paginateRight):not(.paginateLeft):not(.buttonSelected):not(.dot-dot-dot-button) {
        background: $filterPaginationLightHover;
      }
    }
  }
}
.paginateLeft {
  background-color: $themeGreen1;
  &:hover:not(.disabledPagination) {
    background-color: $themeGreen1Dark;
  }
}
.paginateRight {
  background-color: $themeGreen2;
  &:hover:not(.disabledPagination) {
    background-color: $themeGreen2Dark;
  }
}
.dot-dot-dot-button, .buttonSelected {
  &:hover:not(.disabledPagination) {
    cursor: default;
  }
}
.upperBodyPagination {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(min(100%, 30rem));
}
.dark {
  .buttonSelected {
    border-image: linear-gradient(to right, $themeGreen1Dark, $themeGreen2Dark) 1;
  }
  .paginationButton {
    background: $filterPaginationDarkMain;
    &:hover {
      &:not(.paginateRight):not(.paginateLeft):not(.buttonSelected):not(.dot-dot-dot-button) {
        background: $filterPaginationDarkHover;
      }
    }
  }
  .paginateLeft {
    background-color: $themeGreen1Dark;
    &:hover:not(.disabledPagination) {
      background-color: $themeGreen1;
    }
  }
  .paginateRight {
    background-color: $themeGreen2Dark;
    &:hover:not(.disabledPagination) {
      background-color: $themeGreen2;
    }
  }
  .paginateRight, .paginateLeft {
    color: #333;
  }
}
</style>