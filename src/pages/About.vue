<template>
  <span>
    <vue-headful :title="'About - Yiffer.xyz'"/>
    <h1>About Yiffer.xyz</h1>
    <back-to-index/>
    
    <div class="full-width-text-container about-container">
      <h3>Contact</h3>
      <p>
        Should you wish to contact us, please do so at todo@email.com. If you are an artist who wants their content taken down, we will comply with these wishes.
      </p> 

      <h3>About the content</h3>
      <p>
        At Yiffer.xyz we strive to only host content which is publicly available, and we will remove any content from artists who ask us to do so. As the primary site for furry comics, we do believe that artists gain significant amounts of followers through our website, as we display links to any profile we can find in the artist page. We do have a soft quality requirement, meaning that not just any comic will be accepted. Censored comics, comics in foreign languages, or poorly drawn comics will all be excluded by the moderators. Naturally, underage content is not allowed.
      </p> 

      <h3>About advertising</h3>
      <p>
        As the site has grown in content size, visitor numbers, and availability, the cost of running it has increased. The owner has always funded what has been needed out-of-pocket (though with help from kind donators), but as of late 2020 a new approach is being taken. We do not wish to have those typical ugly porn site ads, so instead we choose an approach that, while being a little more work for us, can give something more to the community. Any advertiser on Yiffer.xyz is a creator of some kind of furry-related content themselves. This hopefully leads to benefits helping to run the site for the owner, as well as publicity for the advertisers, and ways of discovering creators for the average user.
      </p>

      <h3>A brief history of the site and its maker</h3>
      <p>
        Yiffer.xyz was an idea formed in 2013 by an eager <a href="https://twitter.com/Malann_kitty" target="_blank"><TwitterIcon/>Malann</a>, who wanted a place to access his favorite furry comics. The idea was formed before I even knew basic HTML and CSS, let alone any programming. Nevertheless, the experimenting began. The following year, I started at a masters degree in materials science at the Norwegian University of Science and Technology, where I swapped to Computer Science half a year in. During the course of the next two years, I learnt programming through university, and web development through creating Yiffer.xyz. In the summer of 2016, the first version of Yiffer.xyz was released.
        <br/><br/>The website had more or less the same look and functionality for four and a half years, until I finally finished with a major update of all the code in late 2020. During these years, the site has suffered DDoS-attacks, which prompted the use of Cloudflare for protection, which has worked very well. This update of 2020 was sorely needed, as the old version of the site was extremely vulnerable due to the developer having little idea of what he was actually doing (the code was not even minified, and "angularjs injections" could be made through the console, for those who know what that means). The update also introduced ads and a bunch of other stuff, including a much more pleasant mod panel. Today, the site's code standard is much more up-to-date, as I now work as a professional web developer and know my stuff.
      </p>

      <h3>Technical</h3>
      <p>
        The tech stack of Yiffer.xyz is a fairly common one for web these days: Vue.js, Node.js with Express, using a MySQL database, running on an Ubunutu VM with an Nginx reverse proxy. Almost all content is served via Cloudflare's DNS servers. Prior to late 2020, Angular.js (v1.6) was used for the front-end part of the site.
      </p>
    </div>
  </span>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import VotingButton from '@/components/VotingButton.vue'
import TwitterIcon from 'vue-material-design-icons/Twitter.vue'

export default {
  name: 'about',

  components: {
    BackToIndex,
    VotingButton,
    TwitterIcon,
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
