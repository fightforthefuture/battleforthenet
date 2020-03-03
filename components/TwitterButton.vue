<template>
  <ShareButton :url="url" :text="text" network="Twitter" />
</template>

<script>
import ShareButton from '~/components/ShareButton'

export default {
  components: {
    ShareButton
  },
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
    }
  }
}
</script>
