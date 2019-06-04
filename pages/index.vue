<style lang="scss">
.index-page {
  h3 {
    font-size: 1.7rem;
  }
  section#cra {
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;

      li {
        border: 1px solid #574b74;
        background-color: #241e31;
        padding: 2rem;
        border-radius: $border-radius;
        margin: 2rem;
      }

      h4 {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 110%;

        img {
          height: 4rem;
          margin-right: 2rem;
        }
      }
    }
  }

  img.app-store {
    height: 5rem;
  }

  .modals {
    margin-top: 3rem;
  }

  .persistent-button img {
    height: 1.9rem;
    width: 12.5rem;
    display: block;
    margin: 0.5rem auto 0;

    @include small-screen {
      display: none;
    }
  }
}
</style>

<template>
  <div class="index-page">
    <section id="bftn-action-form" class="page-header bg-image">
      <div class="container">
        <h1 v-text="isCallPage ? $lt('title_call') : $lt('title')"></h1>
        <div v-html="$lt('intro_html')" class="intro"></div>
        <call-form v-if="isCallPage" page="call"></call-form>
        <petition-form v-else />
        <video-livestream></video-livestream>
      </div>
    </section>

    <section v-for="(section, id) in $lt('sections')" :id="id" :key="id">
      <div class="container">
        <h2 class="section-title">{{ section.title }}</h2>
        <div v-html="section.body_html"></div>
        <battle-stats v-if="id == 'stats'"></battle-stats>
        <widget-instructions v-if="id == 'join'"></widget-instructions>
        <scoreboard v-else-if="id == 'scoreboard'" :summary="true"></scoreboard>
        <!-- <iframe v-else-if="id == 'events'" class="events-map" src="https://events.battleforthenet.com/iframe"></iframe> -->
        <video-roll v-else-if="id == 'net-neutrality'"></video-roll>
        <team-internet v-else-if="id == 'team-internet'"></team-internet>
        <team-cable v-else-if="id == 'team-cable'"></team-cable>
        <wanted-poster v-else-if="id == 'wanted'"></wanted-poster>
      </div>
    </section>

    <persistent-button>
      <a class="btn" href="#bftn-action-form"
         @click="$trackClick('sticky_button_homepage')">
        {{ $lt('persistent_button') }}
        <img src="~/assets/images/arrow-right.svg" alt="">
      </a>
    </persistent-button>
  </div>
</template>

<script>
import { createMetaTags } from '~/assets/js/helpers'
import VideoLivestream from '~/components/VideoLivestream'
import CallForm from '~/components/CallForm'
import PetitionForm from '~/components/PetitionForm'
import Scoreboard from '~/components/Scoreboard'
import VideoRoll from '~/components/VideoRoll'
import SocialSidebar from '~/components/SocialSidebar'
import PersistentButton from '~/components/PersistentButton'
import BattleStats from '~/components/BattleStats'
import TeamInternet from '~/components/TeamInternet'
import TeamCable from '~/components/TeamCable'
import WantedPoster from '~/components/WantedPoster'
import WidgetInstructions from '~/components/WidgetInstructions'

export default {
  components: {
    VideoLivestream,
    CallForm,
    PetitionForm,
    Scoreboard,
    VideoRoll,
    SocialSidebar,
    PersistentButton,
    BattleStats,
    TeamInternet,
    TeamCable,
    WantedPoster,
    WidgetInstructions
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
