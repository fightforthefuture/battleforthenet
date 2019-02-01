<template>
  <div>
    <section class="page-header">
      <div class="container">
        <h1>{{ $lt('title') }}</h1>
        <div v-html="$lt('intro_html')" class="intro"></div>
        <CallForm page="california" />
      </div>
    </section>
    <section id="rep">
      <div class="container">
        <h2 class="section-title">{{ $lt('scoreboard_form.title') }}</h2>
        <div v-html="$lt('scoreboard_form.body_html')"></div>
        <form @submit.prevent="fetchRep()">
          <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
          <div class="flex-row">
            <input type="text"
                   v-model="street"
                   :placeholder="$lt('scoreboard_form.address_placeholder')"
                   class="flex-2"
                   required>
            <input type="tel"
                   v-model="zipCode"
                   :placeholder="$lt('scoreboard_form.zip_placeholder')"
                   required>
            <button class="btn btn-cta btn-large" :disabled="isLoading">
              <span v-if="!isLoading">{{ $lt('scoreboard_form.cta_button') }}</span>
              <span v-else>{{ $lt('scoreboard_form.loading_button') }}</span>
            </button>
          </div>
          <p class="disclaimer">
            <small>{{ $lt('scoreboard_form.disclaimer') }}</small>
          </p>
        </form>
      </div>
    </section>
    <section id="scoreboard">
      <div class="container">
        <h2 class="section-title">{{ $lt('scoreboard.title') }}</h2>
        <div v-html="$lt('scoreboard.body_html')"></div>
        <ScoreboardLegend :neutral="false" />

        <select v-model="voteFilter" class="push-top-3">
          <option value>{{ $lt('scoreboard.vote_filter') }}</option>
          <option value="true">{{ $lt('scoreboard.voted_yes') }}</option>
          <option value="false">{{ $lt('scoreboard.voted_no') }}</option>
        </select>

        <h2 class="push-top-4">{{ $lt('scoreboard.assembly') }}</h2>
        <ScoreboardGroup :politicians="filteredAssemblyMembers" />

        <h2 class="push-top-4">{{ $lt('scoreboard.senators') }}</h2>
        <ScoreboardGroup :politicians="filteredSenators" />
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
import axios from 'axios'
import CallForm from '~/components/CallForm'
import VideoRoll from '~/components/VideoRoll'
import ScoreboardLegend from '~/components/ScoreboardLegend'
import ScoreboardGroup from '~/components/ScoreboardGroup'
import { createMetaTags } from '~/assets/js/helpers'

export default {
  components: {
    CallForm,
    ScoreboardGroup,
    ScoreboardLegend,
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

  data() {
    return {
      isLoading: false,
      errorMessage: null,
      street: null,
      voteFilter: ''
    }
  },

  computed: {
    zipCode: {
      get() {
        return this.$store.state.zipCode
      },

      set(value) {
        this.$store.commit('setZipCode', value)
      }
    },
    filteredAssemblyMembers () {
      if (this.voteFilter) {
        return this.assemblyMembers.filter(p => p.supports_cra.toString() === this.voteFilter)
      } else {
        return this.assemblyMembers
      }
    },
    filteredSenators () {
      if (this.voteFilter) {
        return this.senators.filter(p => p.supports_cra.toString() === this.voteFilter)
      } else {
        return this.senators
      }
    }
  },

  async asyncData() {
    let assemblyMembers = []
    let senators = []

    try {
      const { data } = await axios.get('https://data.battleforthenet.com/scoreboard/california.json')
      assemblyMembers = data.filter(p => p.organization === 'Assembly')
      senators = data.filter(p => p.organization === 'Senate')
    }
    catch (error) {
      console.error(error)
    }

    return { assemblyMembers: assemblyMembers, senators: senators }
  },

  beforeCreate() {
    this.$store.commit('setOrg', 'fftf')
  },

  created() {
    if (this.$route.query.vote) {
      let initVote = this.$route.query.vote.toLowerCase()

      if (initVote === 'yes') {
        this.voteFilter = 'true'
      } else if (initVote === 'no') {
        this.voteFilter = 'false'
      }
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.california.${key}`, vars)
    },

    async fetchRep() {
      this.isLoading = true

      let rep

      try {
        const address = `${this.street} ${this.zipCode}`
        const { data } = await axios.get(`https://07myr1bkfa.execute-api.us-east-1.amazonaws.com/v1/state-scoreboard?address=${encodeURIComponent(address)}`)
        rep = data
      }
      catch (error) {
        //
      }

      if (rep) {
        return this.$router.push({
          name: 'scoreboard-id',
          params: {
            id: rep.bioguide_id
          }
        })
      }
      else {
        this.errorMessage = this.$lt('scoreboard_form.error_rep_not_found')
        this.isLoading = false
      }
    }
  }
}
</script>
