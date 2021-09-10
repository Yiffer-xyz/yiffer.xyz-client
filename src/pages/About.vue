<template>
  <span>
    <h1>About Yiffer.xyz</h1>
    <back-to-index/>
    
    <div class="full-width-text-container about-container">
      <h3>Contact</h3>
      <p>
        If you wish to contact us, please do so by sending an email to contact@yiffer.xyz. If you are an artist who wants their content taken down, we will comply with your wishes. In the future, we plan to let artists take control of their own comics if they wish to, and publish updates themselves. Are you an artist who's interested in this feature? Let us know! This is on our roadmap already, but if people show interest, we might get to it quicker than intially planned.
      </p>

      <h3>About the content</h3>
      <p>
        At Yiffer.xyz we strive to only host content which is publicly available, and we will remove any content from artists who ask us to do so. As the primary site for furry comics, we do believe that artists gain significant amounts of followers through our website, as we display links to any profile we can find in the artist page. We do have a soft quality requirement, meaning that not just any comic will be accepted. Censored comics, comics in foreign languages, or poorly drawn comics will all be excluded by the moderators. Naturally, underage content is not allowed.
      </p> 

      <h3>About advertising</h3>
      <p>
        As the site has grown in content size, visitor numbers, and availability, the cost of running it has increased. The owner has always funded what has been needed out-of-pocket (though with help from kind donators), but as of late 2020 a new approach is being taken. We do not wish to have those typical ugly porn site ads, so instead we choose an approach that, while being a little more work for us, can give something more to the community. Any advertiser on Yiffer.xyz is a creator of some kind of furry-related content themselves. This hopefully leads to benefits helping to run the site for the owner, as well as publicity for the advertisers, and ways of discovering creators for the average user.
      </p>

      <h3>Technical</h3>
      <p>
        The tech stack of Yiffer.xyz is a fairly common one for web these days: Vue.js for the front-end, Node.js with Express for the api, and a MySQL database. An Nginx reverse proxy, served in docker containers on a Google Cloud Platform vm. Almost all content is served via Cloudflare's DNS servers. Prior to 2021, Angular.js (v1.6) was used for the front-end part of the site, and database and file storage were both running locally on a single VM without containers. Now, database and file storage are both GCP SaaS solutions.
      </p>
    </div>
  </span>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'

export default {
  name: 'about',

  components: {
    BackToIndex,
  },

  metaInfo() {
    let title = `About - Yiffer.xyz`
    return {
      title: title,
      meta: [
        {vmid: 'twitterTitle', name: 'twitter:title', content: title},
        {vmid: 'ogTitle', property: 'og:title', content: title},
        {vmid: 'twitterDesc', name: 'twitter:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"},
        {vmid: 'ogDesc', property: 'og:description', content: "The internet's best collection of high quality furry  comics, easily readable and free!"}
      ]
    }
  },
}

</script>

<style lang="scss">
.mini-header {
  font-weight: 400;
  margin-top: 15px;
}
.full-width-text-container {
  margin-right: 10%;
  margin-left: 10%;
  text-align: left;
}
.about-container {
  h3 {
    margin-top: 1rem;
  }
}
</style>
