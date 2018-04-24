<template>
  <a :href="shareURL" @click.prevent="share()" target="_blank" class="btn btn-share" :class="`btn-${network.toLowerCase()}`">
    <slot>Share on {{ network }}</slot>
  </a>
</template>

<script>
import { openPopup } from '~/assets/js/helpers'
import settings from '~/config.json'

export default {
  props: {
    url: {
      type: String,
      required: false,
      default: null
    }
  },

  data() {
    return {
      network: ''
    }
  },

  computed: {
    shareURL() {
      if (this.url) {
        return this.url
      }

      if (this.network) {
        return settings[`${this.network.toLowerCase()}ShareURL`]
      }
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
