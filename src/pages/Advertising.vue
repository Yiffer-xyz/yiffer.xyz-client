<template>
  <div style="width: 100%;">
    <vue-headful :title="'Donate - Yiffer.xyz'"/>
    <h1>Advertising</h1>
    <back-to-index></back-to-index>

    <div class="full-width-text">
      <p>From its initial launch in 2016, until the summer of 2020, Yiffer.xyz has been funded mostly out of the owner's pocket, but also by donators. With the huge upgrade of the site in 2020, costs have increased. As the owner of the site, I want nothing more than to give users the best browsing experience possible, but doing so without other sources of funding would be too expensive at this point. "Regular" ads organized through third parties are hideous and we would like to avoid them if possible. Therefore, we are going to try advertising furry* creators only! Not only will this give opportunities for creators in the community - the ads are much more likely to be relevant to viewers, and are much less annoying.</p>

      <p>
        <b>How it works</b><br/>
        If you are a creator of arts or crafts (digital art, traditional art, fursuits, plushies, writing, etc.), and your content is furry or at least somewhat related, you may apply using the form below! You will submit images or gifs detailed below, which will show up, mainly in the index page of Yiffer.xyz.
      </p>

      <p>
        <b>Is it worth it?</b><br/>
        Probably! As of the summer of 2020, Yiffer.xyz has about 20,000 unique visitors per day. We record how many clicks your ads get and visualize this on your profile page, so after you have been accepted as an advertiser, you can get a better idea of whether or not to keep going.
      </p>

      <p><b>For the earliest advertisers, we are cutting the cost in half during the first few months!</b> So be sure to apply as soon as you're certain, or tell your creative friends!</p>

      <p>
        <b>Pricing</b>
      </p>
      <table class="y-table">
        <thead>
          <tr>
            <th style="width: 7rem">Type</th>
            <th>Duration</th>
            <th style="width: 7.5rem">Price</th>
            <th>Explanation</th>
          </tr>
        </thead>
        <tr>
          <td rowspan="2">As comic card</td>
          <td>2 months</td>
          <td>20$ per month</td>
          <td rowspan="2">
            Your ad will appear at random in the same style as a "comic card" on the index page. 
          </td>
        </tr>

        <tr>
          <td>4 months</td>
          <td>15$ per month</td>
        </tr>

        <tr>
          <td>Wide banner</td>
          <td>1 month</td>
          <td>50$ per month</td>
          <td>
            This is an experimental type of ad. If there is interest for it, we will offer long-term commitments for this ad type as well.<br/><br/>
            Your ad will be displayed <u>above comics</u>, between the comic's title and the first page. This placement is very visible and eye-catching, hence the increased price. 
          </td>
        </tr>
      </table>
      <p class="no-margin-top">As we don't have any experience with advertisers yet, these prices may change in the future. If you have paid for an X-month commitment, you will not be affected by these changes for the duration of your commitment.</p>

      <p>
        <b>Additional explanation</b><br/>
      </p>
      <ul>
        <li>The frequency of your ads showing up entirely depends on how many advertisers there are in total. If there are ten advertisers, every tenth ad (give or take) will be your own. This goes for all types of ads.</li>
        <li>Each price is for a single ad with a single image/gif. It is perfectly fine to apply several times with different images/gifs, but these will be treated as separate ads and you will have to pay for each one.</li>
        <li>Any questions you have now or as an advertiser can be directed to EPOST@EPOST.COM. We will happily answer any questions you may have.</li>
        <li>The ads may be explicit, but don't go overboard. Geniatlia may be visible, but it should not be a big or the entire part of the image/gif.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'

export default {
  name: 'advertising',
  
  components: {
    'back-to-index': BackToIndex,
  },

  mounted () {
    miscApi.logRoute('advertising')
  }
}
</script>
