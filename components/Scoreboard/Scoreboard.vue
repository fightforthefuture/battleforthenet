<style lang="scss" scoped>
.scoreboard {
  text-align: center;
}

.scoreboard-content {
  animation: fade-in .3s;
}

.politicians {
  margin-bottom: 100px;

  &:last-child {
    margin-bottom: 0;
  }
}

.loading {
  margin: 50px auto;
}

a.view-all {
  font-size: 2.6rem;
  font-weight: bold;
  text-transform: uppercase;
  display: block;
  text-align: center;
}
</style>

<template>
  <div class="scoreboard">
    <div class="scoreboard-content">
      <no-ssr>
        <div id="in-state" class="politicians">
          <h2 v-if="!summary">This is where <em>your</em> senators and reps stand. Tweet them first, then call!</h2>
          <team-legend></team-legend>
          <div class="state-selector">
            <p>
              <select v-model="selectedState">
                <option :value="null">Select state</option>
                <option v-for="(name, code) in states" :key="code" :value="code">{{ name }}</option>
              </select>
            </p>
          </div>
          <div v-if="statePoliticians.length > 0">
            <politician-card v-for="politician in statePoliticians" :politician="politician" :key="politician.biocode"></politician-card>
          </div>
          <div v-else-if="selectedState && !isLoadingState">
            <h3>Sorry, but we don't have any data for your state yet.</h3>
          </div>
          <router-link v-if="summary" to="/scoreboard" class="view-all">View all</router-link>
        </div>
      </no-ssr>

      <div id="senate" class="politicians" v-if="!summary">
        <h2>We need just <em>one</em> more vote in the Senate. Tweet them!</h2>
        <team-legend></team-legend>
        <p>(The green ones have already promised to vote for a CRA, so tweet at the ones who haven't yet!)</p>
        <politician-card v-for="politician in senators" :politician="politician" v-if="politician.twitter" :key="politician.biocode"></politician-card>
      </div>

      <div id="house" class="politicians" v-if="!summary">
        <h2>We need 218 votes to win the House.<br>We have {{ houseCRACount }}. {{ 218 - houseCRACount }} to go.</h2>
        <team-legend></team-legend>
        <p>(The green ones have already promised to vote for a CRA, so tweet at the ones who haven't yet!)</p>
        <politician-card v-for="politician in representatives" :politician="politician" v-if="politician.twitter" :key="politician.biocode"></politician-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import TeamLegend from '@/components/Scoreboard/TeamLegend'
import PoliticianCard from '@/components/Scoreboard/PoliticianCard'
import states from '~/assets/data/states'
import { geocodeState } from '~/assets/js/helpers'

export default {
  components: {
    PoliticianCard,
    TeamLegend
  },

  props: {
    summary: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    states: () => states,

    senators() {
      return this.politicians.filter(p => p.organization === 'Senate')
    },

    representatives() {
      return this.politicians.filter(p => p.organization === 'House')
    },

    senateCRACount() {
      return this.senators.filter(p => p.yesOnCRA).length
    },

    houseCRACount() {
      return this.representatives.filter(p => p.yesOnCRA).length
    }
  },

  data() {
    return {
      selectedState: null,
      politicians: [],
      statePoliticians: [],
      isLoadingState: false
    }
  },

  watch: {
    selectedState(newValue) {
      if (!process.browser) return

      if (newValue) {
        localStorage.selectedState = newValue
        this.fetchStatePoliticians()
      }
      else {
        localStorage.removeItem('selectedState')
        this.statePoliticians = []
      }
    }
  },

  async created() {
    if (process.browser) {
      if (localStorage.selectedState) {
        this.selectedState = localStorage.selectedState
      }
      else {
        const { code } = await geocodeState()
        this.selectedState = code
      }
    }

    if (!this.summary) {
      this.fetchPoliticians()
    }
  },

  methods: {
    async fetchPoliticians() {
      if (this.$store.state.politicians.length > 0) {
        this.politicians = this.$store.state.politicians
      }
      else {
        const { data } = await axios.get(`https://data.battleforthenet.com/politicians.json`)
        this.politicians = data
      }
    },

    async fetchStatePoliticians() {
      this.isLoadingState = true
      const { data } = await axios.get(`https://data.battleforthenet.com/politicians/${this.selectedState.toLowerCase()}.json`)
      this.statePoliticians = data
      this.isLoadingState = false
    }
  }
}
</script>
