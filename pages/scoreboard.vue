<style lang="scss" scoped>
.scoreboard {
  margin-bottom: 10rem;
}
</style>

<template>
  <div class="container text-center">
    <section>
      <h1>We can make Congress save net neutrality.</h1>
      <p>To save net neutrality, we need to get every member of Congress to
      promise to vote to overrule the FCC vote. Use this page to track them,
      call them and tweet them. <em>We are just one vote away from winning in the Senate, though we need a lot more votes in the House. Help us get those votes!</em></p>
    </section>

    <section>
      <scoreboard></scoreboard>
      <h2>Done tweeting? Be sure to <router-link to="/">email and call</router-link> your members of Congress too!</h2>
    </section>

    <social-sidebar></social-sidebar>
  </div>
</template>

<script>
import politicians from '~/assets/data/politicians'
import Scoreboard from '~/components/Scoreboard/Scoreboard'
import SocialSidebar from '~/components/SocialSidebar'

export default {
  head: {
    title: 'Battle for the Net Scoreboard'
  },

  components: {
    Scoreboard,
    SocialSidebar
  },

  created() {
    // store politician data in Vuex so Nuxt will pre-render it for this page
    this.$store.commit('setPoliticians', politicians)
  }
}
</script>
