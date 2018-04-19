<style lang="scss">
.business-card {
  font-size: 90%;
  width: 25%;
  padding: 10px;
  float: left;

  .content {
    background-color: #1f1c35;
    border-radius: 8px;
    padding: 10px;
  }

  .logo {
    width: 75px;
    height: 75px;
    border-radius: 100%;
    background-color: #fff;
    margin-bottom: 5px;
    border: 1px solid #CCCAEA;
  }

  .name-location {
    min-height: 95px;
  }

  address {
    font-style: normal;
    font-size: 92%;
  }

  .btn-tweet {
    font-size: 120%;
    width: 80%;
  }
}
</style>

<template>
  <div class="business-card">
    <div class="content">
      <img class="logo" :src="logo" :alt="business.name + ' Logo'">
      <div class="name-location">
        <strong class="truncate">{{ business.name }}</strong>
        <address class="truncate">{{ locationString }}</address>
        <div v-if="business.phone">
          {{ business.phone }}
        </div>
        <a v-if="business.website" :href="business.website" target="_blank" class="truncate">{{ domain }}</a>
      </div>
      <a class="btn btn-tweet" href="#" @click.prevent="openTweetURL">Tweet</a>
    </div>
  </div>
</template>

<script>
import tweetTemplates from '~/assets/data/business-tweets.json'
import { getHostName, openPopup } from '~/assets/js/helpers'

export default {
  props: {
    business: {
      type: Object
    },
    national: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    tweetURL() {
      const template = tweetTemplates[Math.floor(Math.random()*tweetTemplates.length)]
      const tweetText = template.replace('@[NAME]', `@${this.business.twitter}`);
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent('https://www.businessesfornetneutrality.com')}`
    },

    locationString() {
      if (this.business.city && this.business.state) {
        return [this.business.city, this.business.state].join(', ')
      }
      else if (this.business.city) {
        return this.business.city
      }
      else if (this.business.state) {
        return this.business.state
      }
    },

    logo() {
      if (this.business.twitter) {
        return `https://data.battleforthenet.com/images/twitter/${this.business.twitter.toLowerCase()}.jpg`;
      }
    },

    domain() {
      if (this.business.website) {
        return getHostName(this.business.website)
      }
    }
  },

  methods: {
    openTweetURL: function(event) {
      if (event && event.metaKey) {
        window.open(this.tweetURL, '_blank');
      }
      else {
        openPopup(this.tweetURL, 'tweet');
      }

      // var stepNumber = this.national ? 3 : 1;
      // trackEvent('business', 'tweet', 'Step ' + stepNumber + ' - ' + this.business.twitter);
    }
  }
}
</script>