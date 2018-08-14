<style lang="scss">
section p {
  text-align: left;
}
section img {
  max-width: 300px;
}
</style>

<template>
  <div>
    <section class="page-header">
      <div class="container">
        <h1><strong>{{$lt('title')}}</strong></h1>
      </div>
    </section>

    <section v-for="(section, id) in $lt('sections')" :id="id" :key="id">
      <div class="container">
        <img v-if="id === 'fftf'" src="~assets/images/fftf-dark.svg"
             :alt="section.title"/>
        <img v-if="id === 'dp'" src="/images/v2/footer-demandprogress-logo-x2.png"
             :alt="section.title"/>
        <img v-if="id === 'fp'" src="~assets/images/fp-footer-logo.png"
             :alt="section.title"/>
        <div v-html="section.body_html"></div>
      </div> <!-- .container -->
    </section>
  </div>
</template>

<script>
import { createMetaTags } from '~/assets/js/helpers'

export default {
  head() {
    return {
      title: this.$lt('title'),

      meta: createMetaTags({
        title: this.$lt('sharing.title'),
        description: this.$lt('sharing.description'),
        image: this.$lt('sharing.image'),
        url: this.$lt('sharing.url')
      })
    }
  },
  methods: {
    $lt(key) {
      return this.$t(`pages.privacy.${key}`)
    }
  }
}
</script>
