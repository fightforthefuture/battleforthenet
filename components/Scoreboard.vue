<template>
  <div class="scoreboard fade-in">
    <no-ssr>
      <div class="politicians">
        <ScoreboardLegend />
        <div class="state-selector">
          <p>
            <select v-model="selectedState">
              <option :value="null">{{ $lt('select_state') }}</option>
              <option v-for="(name, code) in states" :key="code" :value="code">{{ name }}</option>
            </select>
          </p>
        </div>
        <div v-if="politicians.length > 0">
          <ScoreboardGroup :politicians="politicians" />
        </div>
        <div v-else-if="selectedState && !isLoading">
          <h3>{{ $lt('no_politicians_found') }}</h3>
        </div>
        <p><nuxt-link to="/scoreboard/all/" class="btn">{{ $lt('view_all') }}</nuxt-link></p>
      </div>
    </no-ssr>
  </div>
</template>

<script>
import axios from 'axios'
import states from '~/assets/data/states'
import { geocodeState } from '~/assets/js/helpers'
import ScoreboardGroup from '~/components/ScoreboardGroup'
import ScoreboardLegend from '~/components/ScoreboardLegend'

export default {
  components: {
    ScoreboardGroup,
    ScoreboardLegend
  },

  computed: {
    states: () => states
  },

  data() {
    return {
      selectedState: null,
      politicians: [],
      isLoading: false
    }
  },

  watch: {
    selectedState(newValue) {
      if (!process.browser) return

      if (newValue) {
        localStorage.selectedState = newValue
        this.fetchPoliticians()
      }
      else {
        localStorage.removeItem('selectedState')
        this.politicians = []
      }
    }
  },

  async created() {
    if (!process.browser) return

    if (localStorage.selectedState) {
      this.selectedState = localStorage.selectedState
    }
    else {
      const { code } = await geocodeState()
      this.selectedState = code
    }
  },

  methods: {
    $lt(key, params={}) {
      return this.$t(`components.Scoreboard.${key}`, params)
    },

    async fetchPoliticians() {
      this.isLoading = true
      const { data } = await axios.get(`https://data.battleforthenet.com/scoreboard/${this.selectedState.toLowerCase()}.json`)
      this.politicians = data
      this.isLoading = false
    }
  }
}
</script>
