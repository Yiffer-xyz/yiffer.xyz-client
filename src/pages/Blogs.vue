<template>
  <div style="width: 100%;">
    <h1>Blog</h1>
    <back-to-index></back-to-index>

    <Loading v-if="!blogs.fetched || blogs.fetching" text="Fetching content" class="mt-48 mb-32" />

    <p v-if="blogs.failed" class="mt-48">
      Error fetching blogs: {{blogs.errorMessage}}
    </p>

    <div v-else-if="blogs.fetched" class="full-width-text mt-16">
      <div v-for="blog in blogs.payload" :key="blog.id" class="blog simpleShadowNoHover" :blogid="blog.id">
        <p class="blogTitle underline-link" @click="selectBlog(blog.id)">{{blog.title}}</p>
        <p class="blogAuthor">By {{blog.author}}, {{formatTimestamp(blog.timestamp)}}</p>
        <p v-html="blog.content" class="blogContent" style="text-align: left;"/>
      </div>
    </div>
  </div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import scrollIntoView from 'scroll-into-view-if-needed'
import { format } from 'date-fns'
import Loading from '@/components/LoadingIndicator.vue'
import { doFetch } from '../utils/statefulFetch'
import { mapGetters } from 'vuex'

import miscApi from '../api/miscApi'
import blogApi from '../api/blogApi'

export default {
  name: 'blogs',
  
  components: {
    BackToIndex,
    Loading,
  },

  computed: {
    ...mapGetters([
      'blogs',
    ]),
  },

  data: function () {
    return {
    }
  },

  async mounted () {
    miscApi.logRoute('blog')
    doFetch(this.$store.commit, 'blogs', blogApi.getBlogs())
    if (this.$route.params.id) {
      this.$nextTick(() => this.highlightBlog(this.$route.params.id))
    }
  },

  methods: {
    selectBlog (blogId) {
      this.highlightBlog(blogId)
      this.$router.push({path: '/blog/' + blogId})
    },

    highlightBlog (blogId) {
      let allBlogContainers = document.getElementsByClassName('blog')
      for (let i=0; i<allBlogContainers.length; i++) {
        let blogContainer = allBlogContainers.item(i)
        if (blogContainer.getAttribute('blogid') == blogId) {
          scrollIntoView(blogContainer, {scrollMode: 'if-needed', behavior: 'smooth'})
          blogContainer.classList.add('highlightedBlog')
        }
        else {
          if (blogContainer.classList.contains('highlightedBlog')) {
            blogContainer.classList.remove('highlightedBlog')
          }
        }
      }
    },

    formatTimestamp (timestamp) {
      return format(new Date(timestamp), 'MMM do yyyy')
    }
  },

  metaInfo () {
    let title = `Blog - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry porn comics, easily readable and free!"}
      ]
    }
  },
}
</script>

<style lang="scss">
.blog {
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
}
.blogTitle {
  font-weight: 400;
  font-size: 1.5rem;
  margin-top: 0 !important;
}
.blogAuthor {
  font-size: 0.75rem;
  margin-top: 0 !important;
}
.highlightedBlog {
  background-color: $themeGreen1VeryLight;
  border-color: $themeGreen1VeryLight;
}
.dark {
  .blog {
    background: $comicCardDark;
  }
  .highlightedBlog {
    background-color: $themeGreen1VeryDark;
  }
}
</style>
