<template>
  <div class="buttonsContainer"
        :class="{
          'closedFilterContent': !isFilterSectionExpanded && !isSearchFilteringActive,
          'openFilterContent': isFilterSectionExpanded || isSearchFilteringActive
        }">
    <span v-if="isFilterSectionExpanded || isSearchFilteringActive" class="upperBodyWidth buttonsContainer-inner">
        <div class="searchFilterContentContainer">
          <div class="buttonsRow catButtonsRow">
            <div v-for="(category, index) in ['All', 'Furry', 'MLP', 'Pokemon', 'Other']"
                :key="category"
                :class="{'buttonSelected': $store.getters.categoryFilter.indexOf(category) >= 0}"
                :style="{
                  'border-color': categoryHighlightColors[index],
                  'background-color': $store.getters.categoryFilter.indexOf(category) >= 0 ? categoryHighlightColors[index] : 'transparent',
                }"
                class="searchFilterButton"
                @click="$emit('categoryFilter', category)">
              {{shortenBtnNamesIfSmallScreen(category)}}
            </div>
          </div>

          <div class="buttonsRow tagButtonsRow">
            <div v-for="(tag, index) in ['All', 'M', 'F', 'MF', 'MM', 'FF', 'MF+', 'I']"
                :key="tag"
                :class="{
                  'buttonSelected': $store.getters.tagFilter.indexOf(tag) >= 0,
                  'extraBtnMargins': ['MM','MF+'].indexOf(tag) >= 0,
                }"
                :style="{
                  'border-color': tagHighlightColors[index],
                  'background-color': $store.getters.tagFilter.indexOf(tag) >= 0 ? tagHighlightColors[index] : 'transparent',
                }"
                class="searchFilterButton"
                @click="$emit('tagFilter', tag)">
              {{tag}}
            </div>
          </div>

          <div class="buttonsRow searchButtonsRow">
            <div class="positionRelative">
              <span class="inputIconWrapper inputIconWrapperLeft">
                <SearchIcon title=""/>
              </span>
              <input v-model="searchValue"
                    @input="changeEvent => $emit('searchChanged', changeEvent.target.value)"
                    type="text"
                    placeholder="Title or artist"
                    class="upperBodySearchbox"/>
              <span class="inputIconWrapper inputIconWrapperRight cursorPointer"
                    v-show="searchValue"
                    @click="clearSearchField">
                <CrossIcon title="Clear"/>
              </span>
            </div>

            <div class="positionRelative">
              <span class="inputIconWrapper inputIconWrapperLeft"><TagsIcon title=""/></span>
              <input 
                type="text"
                placeholder="Tags"
                autocomplete="off"
                class="upperBodySearchbox"
                v-model="keywordSearchValue"
                @click="lastActionWasDeselectingKeyword = false"
                @focus="setisKeywordSearchFocused(true)"
                @blur="setisKeywordSearchFocused(false)"
              />
              <span class="inputIconWrapper inputIconWrapperRight cursorPointer"
                    v-show="keywordSearchValue"
                    @click="clearKeywordSearchField">
                <cross-icon title="Clear"/>
              </span>
              <div class="keywordResults" v-if="isKeywordSearchFocused" style="max-height: 11rem;">
                <div
                  v-for="keywordObject in keywordsMatchingSearch" 
                  :key="keywordObject.id"
                  @click="addKeyword(keywordObject)"
                  @mouseover="keywordResultHovered = keywordObject"
                  @mouseout="keywordResultHovered = undefined"
                  class="keywordResult">
                    {{keywordObject.name}} ({{keywordObject.count}})
                </div>
              </div>
            </div>
          </div>

          <div class="selectedKeywords buttonsRow"
              v-if="selectedKeywords.length > 0 || allKeywords.failed" >
            <div v-for="keywordObject in selectedKeywords" 
                :key="keywordObject.id"
                @click="$emit('removeKeyword', keywordObject)"
                class="selectedKeyword">
              {{keywordObject.name}}<CrossIcon title=""/>
            </div>

            <p v-if="allKeywords.failed" style="font-size: 0.8rem;">
              There was an error fetching searchable tags
            </p>
          </div>

          <div :class="isAuthenticated ? 'threeBtnRow' : 'twoBtnRow'" class="buttonsRow">
            <div :class="{'buttonSelected': $store.getters.sorting === 'updated'}"
                :style="{
                  'border-color': sortHighlightColors.updated,
                  'background-color': $store.getters.sorting === 'updated' ? sortHighlightColors.updated : 'transparent',
                }"
                class="searchFilterButton"
                @click="$emit('setSort', 'updated')">
              Recently updated
            </div>
            <div :class="{'buttonSelected': $store.getters.sorting === 'userRating'}"
                :style="{
                  'border-color': sortHighlightColors.userRating,
                  'background-color': $store.getters.sorting === 'userRating' ? sortHighlightColors.userRating : 'transparent',
                }"
                class="searchFilterButton"
                @click="$emit('setSort', 'userRating')">
              User rating
            </div>
            <div v-if="isAuthenticated"
                :class="{'buttonSelected': $store.getters.sorting === 'yourRating'}"
                :style="{
                  'border-color': sortHighlightColors.yourRating,
                  'background-color': $store.getters.sorting === 'yourRating' ? sortHighlightColors.yourRating : 'transparent',
                }"
                class="searchFilterButton"
                @click="$emit('setSort', 'yourRating')">
              Your rating
            </div>
          </div>

          <div class="buttonsRow detailLevelButtonsRow">
            <div :class="{'buttonSelected': detailLevel === 'low'}"
                :style="{
                  'border-color': detailHighlighColors[0],
                  'background-color': detailLevel === 'low' ? detailHighlighColors[0] : 'transparent',
                }"
                class="searchFilterButton"
                @click="$emit('setDetailLevel', 'low')">
              Simple
            </div>
            <div :class="{'buttonSelected': detailLevel === 'high'}"
                :style="{
                  'border-color': detailHighlighColors[0],
                  'background-color': detailLevel === 'high' ? detailHighlighColors[0] : 'transparent',
                }"
                class="searchFilterButton"
                @click="$emit('setDetailLevel', 'high')">
              Detailed
            </div>
          </div>

          <div class="filterSectionExpander filterSectionDeExpander"
                @click="() => {$emit(isSearchFilteringActive ? 'resetAllFilters' : 'toggleShowSearchFiltering', false)}">
            <menu-up-icon class="mdi-arrow" title=""/>
            <p>
              {{isSearchFilteringActive ? 'Reset and minimize' : 'Minimize'}}
            </p>
            <menu-up-icon class="mdi-arrow" title=""/>
          </div>
      </div>
    </span>

    <div v-else class="filterSectionExpander"
         @click="() => {
           if (!isFilterSectionExpanded) {
             $emit('toggleShowSearchFiltering', true)
           }
         }">
      <ChevronRightIcon class="mdi-arrow" title=""/>
      <p>Search &amp; filter</p>
      <ChevronLeftIcon class="mdi-arrow" title=""/>
    </div>
  </div>
</template>

<script>
import SearchIcon from 'vue-material-design-icons/Magnify.vue'
import CrossIcon from 'vue-material-design-icons/Close.vue'
import TagsIcon from 'vue-material-design-icons/TagMultiple.vue'
import MenuDownIcon from 'vue-material-design-icons/MenuDown.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'searchFiltering',

  components: {
    SearchIcon, CrossIcon, TagsIcon, ChevronRightIcon, ChevronLeftIcon,
  },

  props: {
    isSearchFilteringActive: Boolean,
  },

  computed: {
    ...mapGetters([
      'isFilterSectionExpanded',
      'orderedKeywordList',
      'selectedKeywords',
      'allKeywords',
      'isAuthenticated',
      'detailLevel',
    ]),

    keywordsMatchingSearch () {
      return this.orderedKeywordList.filter(keyword => keyword.name.startsWith(this.keywordSearchValue))
    },

    availableSortOptions () {
      if (this.isAuthenticated) {
        return [
          {id: 'updated', text: 'Recently updated'},
          {id: 'userRating', text: 'User rating'},
          {id: 'yourRating', text: 'Your rating'},
        ]
      }
      return [
        {id: 'updated', text: 'Recently updated'},
        {id: 'userRating', text: 'User rating'},
      ]
    },

    sortHighlightColors () {
      return {
        updated: '#9aebe7',
        userRating: this.isAuthenticated ? '#a1f5e5' : '#adfee0',
        yourRating: '#adfee0',
      }
    },
  },

  data: function () {
    return {
      searchValue: '',
      keywordSearchValue: '',
      keywordResultHovered: undefined,
      isKeywordSearchFocused: false,
      lastActionWasDeselectingKeyword: false, // needed because @click of keywordResult fires too often
      categoryHighlightColors: ['#9aebe7', '#9df0e6', '#a1f5e5', '#a6fae3', '#adfee0'],
      tagHighlightColors: ['#9aebe7', '#9ceee7', '#9df1e6', '#a0f3e5', '#a2f6e4', '#a6f9e3', '#a9fbe2', '#adfee0'],
      detailHighlighColors: ['#9aebe7', '#adfee0'],
    }
  },

  methods: {
    clearSearchField () {
      this.searchValue = ''
      this.$emit('searchChanged', '')
    },

    clearKeywordSearchField () {
      this.keywordSearchValue = ''
      this.isKeywordSearchFocused = false
    },

    setisKeywordSearchFocused (isFocused) {
      // Needed because if there is no search term, then technically the results div is 
      // hidden (by the onblur event invoking this method) before the onclick fires,
      // so there is nothing to be "onclicked".
      // In other words, the first if happens whenever the user clicks a keyword.
      if (this.keywordResultHovered) {
        this.addKeyword(this.keywordResultHovered)
        this.keywordResultHovered = null
      } 
      this.isKeywordSearchFocused = isFocused || this.keywordSearchValue != ''
    },

    addKeyword () {
      if (this.lastActionWasDeselectingKeyword) {
        return
      }

      this.lastActionWasDeselectingKeyword = true
      this.$emit('addKeyword', this.keywordResultHovered)
      if (this.keywordSearchValue) {
        this.clearKeywordSearchField()
      }
    },

    shortenBtnNamesIfSmallScreen (btnName) {
      if (this.$breakpoint.xs && btnName === 'Pokemon') {
        return 'Pkmn'
      }
      return btnName
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../scss/shadows.scss";

.buttonsContainer {
  width: 100%;
  overflow: hidden;
  padding: 0.5rem 0;
  margin: 1rem auto;
  max-height: 22rem;
  transition:max-height 0.4s ease-out;
}

.upperBodyWidth {
  width: 50%;
  @media (max-width: 900px) {
    width: 100%;
  }
}

.closedFilterContent {
  padding: 0.5rem 0;
  max-height: 3rem;
}

.openFilterContent {
  padding: 0.5rem 0 1rem 0;
  margin: 1rem auto;
  margin-bottom: 2rem;
  background-color: rgba(255, 255, 255, 0.3);
  @include simpleshadowNoHover;
}

.searchFilterWrapper {
  width: 100%;
}

.searchFilterContentContainer {
  width: 42rem;
  margin: auto;
  @media screen and (max-width: 900px) {
    width: 100%;
  }
}

.buttonsRow {
  width: 100%;
  display: grid;
  margin-bottom: 1rem;
}

.catButtonsRow {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
.tagButtonsRow {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.searchButtonsRow {
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.threeBtnRow {
  grid-template-columns: 1fr 1fr 1fr;
}
.twoBtnRow {
  grid-template-columns: 1fr 1fr;
}
.detailLevelButtonsRow {
  grid-template-columns: 1fr 1fr;
  max-width: 16rem;
  margin-left: auto;
  margin-right: auto;
}

.extraBtnMargins {
  padding-right: 4px !important;
  padding-left: 4px !important;
}

$buttonPadding: 10px;
$highlightHeight: 6px;
$nonHighlightHeight: 2px;

.searchFilterButton {
  border-bottom-width: $nonHighlightHeight;
  border-bottom-style: solid;
  // border-top-width: $nonHighlightHeight;
  // border-top-style: solid;
  padding: $buttonPadding 0;
  padding-top: $buttonPadding - 2px;
  padding-bottom: $buttonPadding - $nonHighlightHeight;
  &:hover {
    cursor: pointer;
  }
}

.buttonSelected {
  border-bottom-width: $highlightHeight;
  border-bottom-style: solid;
  padding-bottom: $buttonPadding - $highlightHeight;
  // background-color: transparent !important;
}

.upperBodySearchbox {
  box-sizing: border-box;
  padding: 9px;
  text-align: center;
  background: #f0f0f0;
  background: rgba(255,255,255,0.8);
  outline: none;
  color: #333;
  width: 100%;
  @media (max-width: 900px) {
    padding: 7px;
  }
}

.keywordResult {
  width: 100%;
  text-align: center;
  color: #444 !important;
  font-size: 12px;
  padding: 5px 0px;
  font-weight: 300;
  &:hover {
    // background-color: $themeGray1;
    color: $themeBlueDark !important;
    cursor: pointer;
  }
}

.keywordResults {
  position: absolute;
  min-width: 100%;
  overflow: auto;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 4px 13px 0px rgba(0,0,0,0.2);
}

.selectedKeywords {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: -0.25rem;
}

.selectedKeyword {
  background-color: $themeBlue;
  color: $themeDark2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  padding: 2px 10px 2.5px 10px;
  border-radius: 15px;
  font-weight: 300;
  margin: 2px;
  &:hover {
    cursor: pointer;
    background-color: $themeBlueDark;
  }
  span {
    svg {
      bottom: -0.22em !important;
      margin-right: -1px;
      padding-left: 4px;
    }
  }
}

.filterSectionExpander {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: fit-content;
  &:hover {
    cursor: pointer;
  }
  svg {
    margin-bottom: 0.25rem;
  }
}

.filterSectionDeExpander {
  margin: 1rem auto -0.25rem auto;
  padding: 0 1rem;
  width: fit-content;
}

::placeholder {
  color: $themeGray8;
  font-size: 12px;
}

.inputIconWrapper {
  color: $themeDark1;
  position: absolute;
  display: block;
  top: 8px;
  @media (max-width: 900px) {
    top: 6px;
  }
}

.inputIconWrapperRight {
  right: 9px;
  @media (max-width: 900px) {
    right: 6px;
  }
  &:hover {
    color: $themeBlueDark;
  }
}

.inputIconWrapperLeft {
  left: 9px;
  @media (max-width: 900px) {
    left: 6px;
  }
}
</style>