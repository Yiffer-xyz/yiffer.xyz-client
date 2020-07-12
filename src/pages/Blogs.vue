<template>
  <div style="width: 100%;">
    <vue-headful :title="'Blog - Yiffer.xyz'"/>
    <h1>Blog</h1>
    <back-to-index></back-to-index>

    <p v-if="!blogs" class="mt-16">Fetching content...</p>

    <div v-else class="full-width-text mt-16">
      <div v-for="blog in blogs" :key="blog.id" class="blog simpleShadowNoHover" :blogid="blog.id">
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

import miscApi from '../api/miscApi'
import blogApi from '../api/blogApi'

export default {
  name: 'blogs',
  
  components: {
    BackToIndex,
  },

  data: function () {
    return {
      blogs: undefined,
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

  async mounted () {
    miscApi.logRoute('blog')
    this.blogs = await blogApi.getBlogs()
    if (this.$route.params.id) {
      this.$nextTick(() => this.highlightBlog(this.$route.params.id))
    }
  }
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
  background-color: $theme8;
}
.dark {
  .blog {
    border: 1px solid #444;
  }
  .highlightedBlog {
    background-color: $theme1;
    border-color: $theme1;
  }
}
</style>