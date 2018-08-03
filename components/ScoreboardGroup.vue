<style lang="scss" scoped>
.politician {
  display: inline-block;
  margin: 1rem;

  .btn {
    display: block;
  }

  @include mobile {
    margin: 0.75rem;
  }
}
</style>

<template>
  <div>
    <h2>{{ title }}</h2>
    <div class="politician" v-for="pol in politicians" :key="pol.biocode">
      <nuxt-link :to="viewLink(pol)"><ScoreboardPhoto :rep="pol" /></nuxt-link>
      <nuxt-link class="btn btn-default" :to="viewLink(pol)">{{ $lt('view_button') }}</nuxt-link>
    </div>
  </div>
</template>

<script>
import ScoreboardPhoto from '~/components/ScoreboardPhoto'

export default {
  components: {
    ScoreboardPhoto
  },

  props: {
    title: String,
    scoreboard: String,
    politicians: Array
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.scoreboard.all.${key}`, vars)
    },

    viewLink({ bioguide_id }) {
      return `/scoreboard/${bioguide_id}/`
    }
  }
}
</script>
