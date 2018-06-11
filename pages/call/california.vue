<style lang="scss" scoped>
.page-header {
  @include big-screen {
    min-height: calc(100vh - #{$footer-height});
  }

  h1 {
    margin-bottom: 2rem;

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
  <section class="page-header">
    <div class="container">
      <h1>{{ $lt('title') }}</h1>
      <div v-html="$lt('body_html')" class="intro"></div>
      <call-form page="california"></call-form>
    </div>
  </section>
</template>

<script>
import CallForm from '~/components/CallForm'

export default {
  components: {
    CallForm
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.call.california.${key}`, vars)
    }
  }
}
</script>
