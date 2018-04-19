<style lang="scss" scoped>
.scoreboard {
  margin-bottom: 100px;
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
  </div>
</template>

<script>
import Scoreboard from '~/components/Scoreboard/Scoreboard'

export default {
  head: {
    title: 'Battle for the Net Scoreboard'
  },

  components: {
    Scoreboard
  }
}
</script>