<template>
  <div class="buttonsContainer"
       :class="{
         'closedFilterContent': !isOpen,
         'openFilterContent': isOpen,
         'overflowVisible': shouldShowOverflow,
       }">
    <span v-if="isOpen" class="upperBodyWidth buttonsContainer-inner">
      <div class="searchFilterContentContainer">
        <div class="buttonsRow catButtonsRow">
          <div v-for="(category, index) in ['All', 'Furry', 'MLP', 'Pokemon', 'Other']"
               :key="category"
               :class="{'buttonSelected': categoryFilter.indexOf(category) >= 0}"
               :style="{
                 'border-color': categoryHighlightColors[index],
                 'background-color': categoryFilter.indexOf(category) >= 0 ? categoryHighlightColors[index] : '',
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
                 'buttonSelected': tagFilter.indexOf(tag) >= 0,
                 'extraBtnMargins': ['MM','MF+'].indexOf(tag) >= 0,
               }"
               :style="{
                 'border-color': tagHighlightColors[index],
                 'background-color': tagFilter.indexOf(tag) >= 0 ? tagHighlightColors[index] : '',
               }"
               class="searchFilterButton"
               @click="$emit('tagFilter', tag)">
            {{tag}}
          </div>
        </div>

        <div class="selectsGrid">
          <Select :options="availableSortOptions"
                  title="Order by"
                  isFullWidth
                  :borderTheme1="true"
                  :defaultValue="availableSortOptions.find(opt => opt.value === this.sortingValue)"
                  @change="onSortingChange"/>

          <Select :options="detailOptions"
                  title="Detail level"
                  isFullWidth
                  :borderTheme2="true"
                  :defaultValue="detailOptions.find(opt => opt.value === this.detailValue)"
                  @change="onDetailLevelChange"/>
        </div>

        <div class="buttonsRow searchButtonsRow" id="searchInputsContainer">
          <TextInput :value="searchValue"
                      @change="onSearchChange"
                      title="Filter by search"
                      startIconVariant="search"
                      includeClearButton
                      borderTheme1
                      placeholder="Title or artist"/>

          <div class="positionRelative">
            <TextInput :value="keywordSearchValue"
                        @change="onKeywordSearchChange"
                        title="Filter by tags"
                        includeClearButton
                        startIconVariant="tags"
                        borderTheme2
                        placeholder="Search tags"
                        @focus="setisKeywordSearchFocused(true)"
                        @blur="setisKeywordSearchFocused(false)"
                        @click="lastActionWasDeselectingKeyword = false"
                        @clear="clearKeywordSearchField"
                        :wrapperStyle="'position: initial'"/>
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

        <div class="filterSectionExpander filterSectionDeExpander"
              @click="() => {$emit(isSearchFilteringActive ? 'resetAllFilters' : 'toggleShowSearchFiltering', false)}">
          <MenuUpIcon class="mdi-arrow" title=""/>
          <p>
            {{isSearchFilteringActive ? 'Reset and minimize' : 'Minimize'}}
          </p>
          <MenuUpIcon class="mdi-arrow" title=""/>
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
      <p>Search / filter / tags / order</p>
      <ChevronLeftIcon class="mdi-arrow" title="" />
    </div>
  </div>
</template>

<script>
import CrossIcon from 'vue-material-design-icons/Close.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft.vue'
import MenuUpIcon from 'vue-material-design-icons/ChevronUp.vue'

import Select from '../../components/Select.vue'
import TextInput from '../../components/TextInput.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'searchFiltering',

  components: {
    Select, TextInput,
    CrossIcon, ChevronRightIcon, ChevronLeftIcon, MenuUpIcon,
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
      'searchFiltering',
      'detailLevel',
      'sorting',
      'tagFilter',
      'categoryFilter',
    ]),

    isOpen () {
      return this.isFilterSectionExpanded || this.isSearchFilteringActive
    },

    keywordsMatchingSearch () {
      return this.orderedKeywordList.filter(
        keyword => keyword.name.startsWith(this.keywordSearchValue.toLowerCase()))
    },

    availableSortOptions () {
      if (this.isAuthenticated) {
        return [
          {text: 'Recently updated', value: 'updated'},
          {text: 'User rating', value: 'userRating'},
          {text: 'Your rating', value: 'yourRating'},
        ]
      }
      return [
        {value: 'updated', text: 'Recently updated'},
        {value: 'userRating', text: 'User rating'},
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

  watch: {
    sorting (newSorting) {
      this.sortingValue = newSorting
    },
    detailLevel (newDetailLevel) {
      this.detailValue = newDetailLevel
    },
    searchFiltering (newSearchFiltering) {
      this.searchValue = newSearchFiltering
    },
    isOpen (newIsOpen) {
      // This stuff in order to ensure smooth slide-expand when opening, and also
      // allowing keyword search results to expand beyond the container when open
      if (newIsOpen) {
        setTimeout(() => {
          this.shouldShowOverflow = true
        }, 400)
      }
      else {
        this.shouldShowOverflow = false
      }
    }
  },

  data: function () {
    return {
      sortingValue: this.sorting || 'updated',
      detailValue: this.detailLevel || 'low',
      searchValue: this.searchFiltering || '',
      keywordSearchValue: '',
      keywordResultHovered: undefined,
      isKeywordSearchFocused: false,
      lastActionWasDeselectingKeyword: false, // needed because @click of keywordResult fires too often
      categoryHighlightColors: ['#9aebe7', '#9df0e6', '#a1f5e5', '#a6fae3', '#adfee0'],
      tagHighlightColors: ['#9aebe7', '#9ceee7', '#9df1e6', '#a0f3e5', '#a2f6e4', '#a6f9e3', '#a9fbe2', '#adfee0'],
      detailHighlighColors: ['#9aebe7', '#adfee0'],
      shouldShowOverflow: false,
      detailOptions: [
        {value: 'minimum', text: 'Minimum'},
        {value: 'low', text: 'Simple'},
        {value: 'high', text: 'Detailed'},
      ]
    }
  },

  mounted () { 
    if (this.isOpen) {
      this.shouldShowOverflow = true
    }

    if (this.detailLevel) {
      this.detailValue = this.detailLevel
    }
  },

  methods: {
    onSearchChange (newSearch) {
      this.searchValue = newSearch
      this.$emit('searchChanged', newSearch)
    },

    onKeywordSearchChange (newSearch) {
      this.keywordSearchValue = newSearch
    },

    onSortingChange (newSort) {
      this.$emit('setSort', newSort)
    },

    onDetailLevelChange (newDetail) {
      this.$emit('setDetailLevel', newDetail)
    },

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
  padding: 0.5rem 0;
  margin: 0 auto 1rem auto;
  max-height: 27rem;
  transition:max-height 0.4s linear;
  overflow: hidden;
}

.overflowVisible {
  overflow: visible;
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
  @media (min-width: 901px) {
    margin-bottom: 1.5rem;
  }
}

.openFilterContent {
  padding: 1rem 0;
  margin: 1rem auto;
  margin-bottom: 2rem;
  background-color: $filterPaginationDarkMain;
  max-height: 27rem;
  @include simpleshadowNoHover;
}

.searchFilterWrapper {
  width: 100%;
}

.searchFilterContentContainer {
  width: 42rem;
  margin: auto;
  padding: 0 0.5rem;
  box-sizing: border-box;
  @media screen and (max-width: 900px) {
    width: 100%;
  }
}

.buttonsRow {
  width: 100%;
  display: grid;
  margin-bottom: 1.5rem;
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
$hoverBorderWidth: 6px;

.searchFilterButton {
  border-bottom-width: $nonHighlightHeight;
  border-bottom-style: solid;
  padding: $buttonPadding 0;
  padding-top: $buttonPadding - 2px;
  padding-bottom: $buttonPadding - $nonHighlightHeight;
  &:hover {
    cursor: pointer;
    border-bottom-width: $hoverBorderWidth;
    padding-bottom: $buttonPadding - $nonHighlightHeight - ($hoverBorderWidth - 2px);
  }

  @media screen and (min-width: 900px) {
    transition: border-bottom-width 100ms linear, padding-bottom 100ms linear;
  }
}

.buttonSelected {
  border-bottom-style: solid;
  padding-bottom: $buttonPadding - $highlightHeight;
  border-image: none;
}

.keywordResult {
  width: 100%;
  text-align: center;
  color: #444;
  font-size: 12px;
  padding: 5px 0px;
  font-weight: 300;
  &:hover {
    background: linear-gradient(to left, $themeGreen1, $themeGreen2);
    cursor: pointer;
  }
}

.keywordResults {
  position: absolute;
  min-width: 100%;
  overflow: auto;
  flex-direction: column;
  justify-content: center;
  z-index: 3;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 13px 0px rgba(0,0,0,0.2);
}

.selectedKeywords {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: -0.5rem;
}

.selectedKeyword {
  background-color: $themeBlueDark;
  color: white;
  font-size: 0.95rem;
  padding: 2px 12px 4px 10px;
  border-radius: 15px;
  margin: 2px;
  font-weight: 300;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: background-color 100ms, border-color 100ms, box-shadow 100ms;
  &:hover {
    cursor: pointer;
    background-color: $themeBlueDarker;
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
  span {
    margin-top: 4px;
  }
  &:hover {
    cursor: pointer;
  }
  svg {
    margin-bottom: 0.25rem;
  }
  p, svg {
    color: $themeBlueDark;
    font-weight: 300;
  }
}

.filterSectionDeExpander {
  padding-top: 1rem;
  width: fit-content;
}

::placeholder {
  color: $themeGray8;
  font-size: 12px;
}

.selectsGrid {
  margin-bottom: 1.75rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: 340px) {
    grid-template-columns: 1fr;
  }
  gap: 1rem;
}

.dark {
  .buttonSelected {
    color: #333;
  }
  .keywordResults {
    background: $themeDark1;
  }
  .keywordResult {
    color: white;
    &:hover {
      color: #444;
    }
  }
  .selectedKeyword {
    background-color: $themeBlueDT;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    font-weight: 600;
    &:hover {
      background-color: $themeBlueDTDarker;
    }
  }
  .filterSectionExpander {
    p, svg {
      color: white;
    }
  }
}

</style>