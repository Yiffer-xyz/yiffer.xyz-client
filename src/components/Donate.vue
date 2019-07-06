<template>
	<div style="width: 100%;">
		<vue-headful :title="'Donate - Yiffer.xyz'"/>
    <h1>Donating</h1>
    <back-to-index></back-to-index>

    <div class="whole-body-text">
      <p>
        <b>Why?</b><br/>
        As you may have noticed, this website does not have any ads. This is because we want to provide you with the best possible browsing experience. This also means that we do not make any money in any way. Hosting this website definitely isn't free, and it has been funded by one owner's pocket money from day one. If you are a frequent user of this site and feel like we're worth it, please consider helping out with a few bucks!
      </p>
      <p>
        <b>How will donations affect the website overall?</b><br/>
        The intention is to cover some of the costs of running the site. Current expenses are hosting on DigitalOcean, Cloudflare's CDN, and an annual domain fee. These are being covered by the site owner alone.
      </p>
      <p>
        <b>What do I get?</b><br/>
        Aside from our deepest gratitude, if you donate $5 or more, you'll be able to download individual comics with the simple click of a button!
      </p>
      <p>
        <b>How to donate</b><br/>
        Paypal! We previously used ko-fi until the account was suspended for being related to adult content. It seems Paypal is the only reliable option left. We know many people don't like Paypal, sorry!
        <br/>
        <ul style="padding-left: 20px;">
          <li>
            If you'd like to donate with cryptocurrency or any other form of payment, please send an email to "malann.sjakk@gmail.com".
          </li>
          <li>
            Donate $5 or more to gain access to downloading comics!
          </li>
          <li>
            If you do want the download privilege, please include your username in the message box. It won't be instant, but you should be able to download within 24 hours.
          </li>
          <li>
            Please <u>do not check the box "Paying for goods or services" when paying via Paypal</u>, as this is considered a donation, not a purchase.
          </li>
        </ul>
        <a href="https://www.paypal.me/yifferxyz" target="_blank" style="margin-top: 8px;">
          <button class="y-button" style="width: 100%; padding: 12px; font-size: 16px;">
            <paypal-icon/> Help us out!
          </button>
        </a>
      </p>
      <p>
        <b>I have donated. How do I download?</b><br/>
        Simple! You click a comic, and then hit the "download comic" button located below the title and artist name. You must be logged in for the button to appear.
        If you have donated and suspect that something is wrong, please send an email to malann.sjakk@gmail.com. Please note that it might take up to 24 hours for your downloading privileges to appear. 
				The 'donator' status on your profile will also change when you have been granted the privileges.
      </p>
    </div>
	</div>
</template>

<script>
import BackToIndex from '@/components/BackToIndex.vue'
import PaypalIcon from 'vue-material-design-icons/Paypal.vue'

export default {
	name: 'admin',
	components: {
    'back-to-index': BackToIndex,
    'paypal-icon': PaypalIcon,
	},
}
</script>
