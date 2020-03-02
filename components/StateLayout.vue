<template>
  <div>
    <section class="page-header">
      <div class="container">
        <h1>{{ $lt('title') }}</h1>
        <div v-html="$lt('intro_html')" class="intro"></div>
        <CallForm :page="state" />
      </div>
    </section>
  </div>
</template>

<script>
import CallForm from '~/components/CallForm'
import { createMetaTags } from '~/assets/js/helpers'

export default {
  components: {
    CallForm
  },

  head() {
    return {
      title: this.$lt('title'),
      meta: createMetaTags({
        title: this.$lt('social.title'),
        description: this.$lt('social.description'),
        image: this.$lt('social.image'),
        url: this.$lt('social.url')
      })
    }
  },

  props: {
    state: {
      type: String,
      required: true
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.${this.state}.${key}`, vars)
    }
  }
}
</script>
