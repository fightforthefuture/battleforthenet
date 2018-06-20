<style lang="scss" scoped>
.page-header {
  // @include big-screen {
  //   min-height: calc(100vh - #{$footer-height});
  // }

  h1 {
    font-size: 3.5rem;
    @include small-screen {
      font-size: 3.2rem;
      margin-bottom: 0;
    }
  }

  .intro {
    margin-bottom: 2rem;
  }
}
</style>

<template>
  <div>
    <section class="page-header">
      <div class="container">
        <h1>{{ $lt('title') }}</h1>
        <div v-html="$lt('body_html')" class="intro"></div>
        <call-form page="california"></call-form>
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
import TeamInternet from '~/components/TeamInternet'
import TeamCable from '~/components/TeamCable'
import { createMetaTags } from '~/assets/js/helpers'

export default {
  components: {
    CallForm,
    VideoRoll,
    TeamInternet,
    TeamCable
  },

  head() {
    return {
      title: this.$lt('title'),
      meta: createMetaTags({
        title: this.$lt('share_title'),
        description: this.$lt('share_description'),
        image: this.$lt('share_image'),
        url: this.$lt('share_url')
      })
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.call.california.${key}`, vars)
    }
  }
}
</script>
