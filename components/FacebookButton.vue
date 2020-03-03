<template>
  <ShareButton :url="url" network="Facebook" />
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
    }
  }
}
</script>
