<style lang="scss">
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

.modal-tip {
  background-color: #2f2940;
  padding: 1rem 2rem;
  border-radius: $border-radius;
  margin-top: 4rem;
  position: relative;

  // arrow
  &:after {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #2f2940;
    border-width: 1.5rem;
    margin-left: -1.5rem;
  }

  code {
    color: #8a7cae;
    background-color: #262035;
  }

  .btn {
    background-color: #7652d1;
    letter-spacing: 0.25rem;
    font-size: 2rem;

    &:hover {
      background-color: darken(#7652d1, 5%);
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
</style>

<template>
  <div>
    <section id="bftn-action-form" class="page-header">
      <div class="container">
        <h1>{{ $lt('title') }}</h1>
        <div v-html="$lt('intro_html')" class="intro"></div>
        <call-form v-if="isCallPage" page="call"></call-form>
        <petition-form v-else />
      </div>
    </section>

    <section v-for="(section, id) in $lt('sections')" :id="id" :key="id">
      <div class="container">
        <h2 class="section-title">{{ section.title }}</h2>
        <div v-html="section.body_html"></div>
        <battle-stats v-if="id == 'stats'"></battle-stats>
        <scoreboard v-else-if="id == 'scoreboard'" :summary="true"></scoreboard>
        <iframe v-else-if="id == 'events'" class="events-map" src="https://events.battleforthenet.com/iframe"></iframe>
        <video-roll v-else-if="id == 'net-neutrality'"></video-roll>
        <team-internet v-else-if="id == 'team-internet'"></team-internet>
        <team-cable v-else-if="id == 'team-cable'"></team-cable>
      </div>
    </section>

    <persistent-button><a class="btn" href="#bftn-action-form">{{ $lt('persistent_button') }} <img src="~/assets/images/persistent-button-arrow.svg" alt=""></a></persistent-button>
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
