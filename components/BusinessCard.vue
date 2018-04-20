<style lang="scss">
.business-card {
  font-size: 1.4rem;
  width: 25%;
  padding: 1rem;
  float: left;

  @media screen and (max-width: $PAGE_WIDTH) {
    width: 33%;
  }

  @include mobile {
    width: 50%;
  }

  .content {
    background-color: #1f1c35;
    border-radius: $border-radius;
    padding: 10px;
  }

  .logo {
    width: 7.5rem;
    height: 7.5rem;
    border-radius: 100%;
    background-color: #fff;
    margin-bottom: 0.5rem;
    border: 1px solid #CCCAEA;
  }

  .name-location {
    min-height: 9.5rem;
  }

  address {
    font-style: normal;
    font-size: 92%;
  }

  .btn-twitter {
    width: 80%;

    &:before {
      content: none;
    }
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
      <a class="btn btn-twitter" href="#" @click.prevent="openTweetURL">Tweet</a>
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
