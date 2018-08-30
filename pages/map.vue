<style lang="scss">
$btn-color: lighten(#544090, 20%);

body.map-page {
  .map-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
  }

  .bftn-footer {
    display: none;
  }
}
</style>

<template>
  <div>
    <EventsMap />
  </div>
</template>

<script>
import { createMetaTags } from '~/assets/js/helpers'
import EventsMap from '~/components/EventsMap'

export default {
  components: {
    EventsMap
  },

  head() {
    return {
      meta: createMetaTags(this.$lt('social'))
    }
  },

  mounted() {
    document.body.classList.add('map-page')
  },

  methods: {
    $lt(key) {
      return this.$t(`pages.map.${key}`)
    }
  }
}
</script>
