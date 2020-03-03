<template>
  <div>
    <section class="page-header">
      <div class="container">
        <h1>{{ $lt('title') }}</h1>
        <div v-html="$lt('intro_html')" class="intro"></div>
        <CallForm :page="state" />
      </div>
    </section>
    <section id="net-neutrality">
      <div class="container">
        <h2 class="section-title">{{ $t('pages.index.sections.net-neutrality.title') }}</h2>
        <div v-html="$t('pages.index.sections.net-neutrality.body_html')"></div>
        <video-roll></video-roll>
      </div>
    </section>
  </div>
</template>

<script>
import CallForm from '~/components/CallForm'
import VideoRoll from '~/components/VideoRoll'
import { createMetaTags } from '~/assets/js/helpers'

export default {
  components: {
    CallForm,
    VideoRoll
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

  beforeCreate() {
    this.$store.commit('setOrg', 'fftf')
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.${this.state}.${key}`, vars)
    }
  }
}
</script>
