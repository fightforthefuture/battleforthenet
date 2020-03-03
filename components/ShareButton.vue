<template>
  <a :href="shareURL" @click.prevent="share()" target="_blank" class="btn btn-share" :class="`btn-${networkName}`">
    <slot>Share on {{ network }}</slot>
  </a>
</template>

<script>
import { openPopup } from '~/assets/js/helpers'

export default {
  props: {
    url: {
      type: String,
      required: false,
      default: null
    },
    text: {
      type: String,
      required: false,
      default: null
    },
    network: {
      type: String,
      required: false,
      default: null
    }
  },

  computed: {
    networkName() {
      return this.network.toLowerCase()
    },
    shareURL() {
      const network = this.networkName

      let url = this.url || this.$store.state[`${network}ShareURL`] || this.$t('social.share_url')
      const text = this.text || this.$t('social.tweet_text')

      if (network === 'facebook' && !url.match(/facebook\.com\/sharer/)) {
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      }
      else if (network === 'twitter' && !url.match(/twitter\.com\/intent\/tweet/)) {
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
      }

      return url
    }
  },

  methods: {
    share() {
      openPopup(this.shareURL, 'share')
      this.$emit('clicked')
    }
  }
}
</script>
