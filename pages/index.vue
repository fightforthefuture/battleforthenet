<style lang="scss" scoped>
img.app-store {
  height: 5rem;
}

.modals a {
  width: 50%;
  padding: 1rem;
}
</style>

<template>
  <div class="container">
    <section id="bftn-action-form">
      <loader-logo></loader-logo>
      <h1 class="text-center">{{ $lt('title') }}</h1>
      <call-form v-if="isCallPage" page="call"></call-form>
      <petition-form v-else />
    </section>

    <section v-for="(section, id) in $lt('sections')" :id="id" :key="id">
      <h2>{{ section.title }}</h2>
      <div v-html="section.body_html"></div>
      <battle-stats v-if="id == 'stats'"></battle-stats>
      <scoreboard v-else-if="id == 'scoreboard'" :summary="true"></scoreboard>
      <iframe v-else-if="id == 'events'" class="events-map" src="https://events.battleforthenet.com/iframe"></iframe>
      <video-roll v-else-if="id == 'net-neutrality'"></video-roll>
      <team-internet v-else-if="id == 'team-internet'"></team-internet>
      <team-cable v-else-if="id == 'team-cable'"></team-cable>
    </section>

    <social-sidebar />
    <persistent-button><a class="btn" href="#bftn-action-form">{{ $lt('persistent_button') }}</a></persistent-button>
  </div>
</template>

<script>
import { createMetaTags } from '~/assets/js/helpers'
import LoaderLogo from '~/components/LoaderLogo'
import CallForm from '~/components/CallForm'
import PetitionForm from '~/components/PetitionForm'
import Scoreboard from '~/components/Scoreboard/Scoreboard'
import VideoRoll from '~/components/VideoRoll'
import SocialSidebar from '~/components/SocialSidebar'
import PersistentButton from '~/components/PersistentButton'
import BattleStats from '~/components/BattleStats'
import TeamInternet from '~/components/TeamInternet'
import TeamCable from '~/components/TeamCable'

export default {
  components: {
    LoaderLogo,
    CallForm,
    PetitionForm,
    Scoreboard,
    VideoRoll,
    SocialSidebar,
    PersistentButton,
    BattleStats,
    TeamInternet,
    TeamCable
  },

  computed: {
    isCallPage() {
      return this.$route.name === 'call' || this.$route.query.call
    }
  },

  methods: {
    $lt(key) {
      return this.$t(`pages.index.${key}`)
    }
  }
}
</script>
