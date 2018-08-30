<template>
  <div>
    <section class="page-header">
      <div class="container">
        <h1>{{ $lt('title') }}</h1>
        <div v-html="$lt('intro_html')" class="intro"></div>
        <CallForm page="california" />
      </div>
    </section>
    <section id="live">
      <div class="container">
        <h2 class="section-title">Live Stream of the Vote</h2>
        <p>
          The California Assembly is currently in session and expected to vote
          on SB 822 soon. SB 822 is item number 223 in this
          <a href="https://leginfo.legislature.ca.gov/faces/billResultsClient.xhtml?location=AFLOOR&agendadate=08%2F30%2F2018&description=Assembly+Floor+Session" target="_blank">agenda</a>.
        </p>
        <iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffightfortheftr%2Fvideos%2F2175719599342507%2F&show_text=0&width=476" width="476" height="476" style="border:none;overflow:hidden;max-width:100%" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>
      </div>
    </section>
    <section id="rep">
      <div class="container">
        <h2 class="section-title">{{ $lt('scoreboard_form.title') }}</h2>
        <div v-html="$lt('scoreboard_form.body_html')"></div>
        <form @submit.prevent="fetchRep()">
          <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
          <div class="flex-row">
            <input type="text" v-model="street" :placeholder="$lt('scoreboard_form.address_placeholder')" required class="flex-2">
            <input type="tel" v-model="zipCode" :placeholder="$lt('scoreboard_form.zip_placeholder')" required>
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
        <ScoreboardLegend
          :against="$lt('scoreboard.legend_against')"
          :supports="$lt('scoreboard.legend_supports')"
          />
        <ScoreboardGroup :politicians="politicians" />
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
      street: null
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
    }
  },

  async asyncData() {
    let politicians = []

    try {
      const { data } = await axios.get('https://data.battleforthenet.com/scoreboard/california.json')
      politicians = data.filter(p => p.organization === 'Assembly')
    }
    catch (error) {
      console.error(error)
    }

    return { politicians: politicians }
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
