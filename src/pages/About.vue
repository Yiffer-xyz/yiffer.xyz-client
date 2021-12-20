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

      <h3>Privacy Policy</h3>
      <p>
        Yiffer.xyz collects visitor data and analyzes traffic on our site. This information helps us understand customer interests and helps us improve our website. When you visit our site, the pages that you look at, and a short text file called a cookie, are downloaded to your computer. A cookie is used to store small amounts of information. This information is collected both for traffic analysis and to improve your experience by remembering certain choices you make regarding color themes and search settings. The cookie does not contain personal details. We do not sell, give, or trade the statistics we store to any 3rd parties for data-mining or marketing purposes. We also use Google Analytics to get visitor statistics - please see <a href="https://policies.google.com/technologies/partner-sites" class="underline-link">https://policies.google.com/technologies/partner-sites</a> for more information on how Google uses cookies to process and collect data.
      </p>
      <br>
      <p>
        When you create an account at Yiffer.xyz, your email is connected to this account and stored on our website. This is purely to enable password resets in case you forget your password. Additionally, if you apply as an advertiser, you might receive emails regarding your active adverts. 
      </p>

      <h3>Terms of Use</h3>
      <p>
        By using this site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms of Use; (2) you are above 18 years of age; (3) you will not access the site through automated or non-human means unless granted permission to do so; (4) you will not use the site for any illegal or unauthorized purpose; (5) your use of the sute will not violate any applicable law or regulation.
      </p>
      <br>
      <p>
        Yiffer.xyz is not responsible for any other websites that are linked to.
      </p>
      <br>
      <p>
        Most content management on Yiffer.xyz is handled by moderators. This includes all uploads of artwork, all managing of comic and artist information, as well as handling most types of feedback submitted by users. Some more important data is handled by the site's admins. This includes "feedback" submitted by users, as well as all advertising management.
      </p>
      <br>
      <p>
        By creating an account on Yiffer.xyz you accept responsibility that your account is not used by unauthorized parties, and that any action made by your account comply with these terms. Should you use your account in any way that does not comply with these terms, or to repeatedly provide incorrect suggestions to the moderator team, Yiffer.xyz may decide to terminate your account.
      </p>
      <br>
      <p>
        Yiffer.xyz does not own the rights to any artwork displayed on the website. All artwork is submitted by moderators, who, to the best of their ability, will only submit artwork that is publicly available. Moderators are instructed to always provide as many links to the original artists as possible. Should an artist wish some of their artwork to be taken down, they may contact us via email at contact@yiffer.xyz, and we will comply.
      </p>
      <br>
      <p>
        Users that have the possibility to upload artwork are prohibited from uploading artwork that is intended to be paid for, or that is otherwise not available for free online.
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
