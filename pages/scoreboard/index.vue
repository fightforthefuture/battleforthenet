<style lang="scss">
.scoreboard-index {
  .page-header {
    background-color: $alt-bg-color;
    min-height: 100vh;

    .intro {
      margin-bottom: 2rem;
    }

    input.street {
      flex: 2;
    }
  }

  .view-all {
    margin: 10rem 0;

    a {
      color: #594686;
      text-transform: uppercase;

      &:hover {
        color: lighten(#594686, 10%);
      }
    }
  }

  @include mobile {
    h2 {
      font-size: 3rem;
    }
  }
}
</style>

<template>
  <div class="scoreboard-index">
    <section class="page-header fill-height">
      <div class="container">
        <h2>{{ $lt('title') }}</h2>
        <div class="intro" v-html="$lt('intro_html')"></div>
        <scoreboard-form btn-class="btn btn-large btn-cta"></scoreboard-form>
        <div class="view-all">
          <nuxt-link to="/scoreboard/all">{{ $lt('view_all') }}</nuxt-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { createMetaTags } from '~/assets/js/helpers'
import ScoreboardForm from '~/components/ScoreboardForm'

export default {
  components: {
    ScoreboardForm
  },

  head() {
    return {
      title: this.$lt('title'),
      meta: createMetaTags({
        title: this.$t('pages.scoreboard.social.title'),
        description: this.$t('pages.scoreboard.social.description'),
        image: this.$t('pages.scoreboard.social.image'),
        url: this.$t('pages.scoreboard.social.url')
      })
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.scoreboard.index.${key}`, vars)
    }
  }
}
</script>
