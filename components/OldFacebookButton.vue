<template>
  <a :href="shareURL" @click.prevent="share()" target="_blank" class="btn btn-facebook">
    <slot>Share on Facebook</slot>
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
    }
  },

  computed: {   
    shareURL() {
      if (this.url) {
        return this.url
      }
      return this.$store.state.facebookShareURL
    }
  },

  methods: {
    share() {
      openPopup(this.shareURL, 'facebook')
    }
  }
}
</script>