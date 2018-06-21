<style lang="scss" scoped>
.scoreboard-all {
  padding-bottom: 20rem;
  background-color: $alt-bg-color;
}

.container {
  width: 700px;
}

.page-header {
  h1 {
    font-size: 5rem;

    @include mobile {
      font-size: 4rem;
    }
  }
}

section {
  background-color: transparent;
  padding: 3rem;

  h2 {
    font-size: 3rem;
  }

  @include mobile {
    padding: 1rem;
  }
}

.legend {
  font-size: 1.8rem;
  background-color: #171321;
  border-radius: $border-radius;
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;

  @include small-screen {
    display: block;

    .team-cable {
      margin-bottom: 1rem;
    }
  }

  label {
    color: #fff;
    padding: .5rem 1.5rem;
    font-weight: 600;
    border-radius: $border-radius;
    min-width: 7rem;
  }

  .team-cable, .team-internet {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;

    span {
      line-height: 1.1;
      display: inline-block;
      font-size: 1.6rem;
      padding-left: 1rem;
      text-align: left;
    }
  }

  .team-cable {
    color: #ff2a2a;

    label {
      background: linear-gradient(90deg, rgba(255,74,74,1) 0%, rgba(255,56,56,1) 100%);
    }
  }

  .team-internet {
    color: #0cdbb1;

    label {
      background: linear-gradient(90deg, rgba(55,191,164,1) 0%, rgba(53,118,173,1) 100%);
    }
  }
}

.state-selector {
  margin: 3rem 0 0;
}

.persistent-button .btn {
  font-size: 3rem;
}
</style>

<template>
  <div class="scoreboard-all">
    <section class="page-header">
      <div class="container">
        <h1>{{ $lt('title') }}</h1>
        <div class="intro" v-html="introHTML"></div>
        <div class="legend">
          <div class="team-cable">
            <label>{{ $lt('legend.against_label') }}</label>
            <span>=</span>
            <span>{{ $lt('legend.against_description') }}</span>
          </div>
          <div class="team-internet">
            <label>{{ $lt('legend.for_label') }}</label>
            <span>=</span>
            <span>{{ $lt('legend.for_description') }}</span>
          </div>
        </div>
        <div class="state-selector">
          <select v-model="selectedState">
            <option :value="null">{{ $lt('state_placeholder') }}</option>
            <option v-for="state in sortedStateNames" :key="state" :value="state">{{ state }}</option>
          </select>
        </div>
      </div>
    </section>
    <section v-for="state in sortedStateNames" :key="state" :id="sectionId(state)">
      <div class="container">
        <h2>{{ state }}</h2>
        <scoreboard-photo :politician="pol" v-for="pol in politiciansByState[state]" :key="pol.biocode"></scoreboard-photo>
      </div>
    </section>

    <persistent-button><a class="btn" href="#" @click.prevent="scrollToTop()">{{ $lt('persistent_button') }}</a></persistent-button>
  </div>
</template>

<script>
import politicians from '~/assets/data/politicians'
import { smoothScrollTo } from '~/assets/js/helpers'
import ScoreboardPhoto from '~/components/ScoreboardPhoto'
import PersistentButton from '~/components/PersistentButton'

export default {
  head() {
    return {
      title: 'Net Neutrality Scoreboard'
    }
  },

  components: {
    ScoreboardPhoto,
    PersistentButton
  },

  data() {
    return {
      selectedState: null
    }
  },

  watch: {
    selectedState(newValue) {
      if (newValue) {
        const sectionId = this.sectionId(newValue)
        const el = document.getElementById(sectionId)

        if (el) {
          smoothScrollTo(el.offsetLeft, el.offsetTop, 500)
          location.hash = `#${sectionId}`
        }
      }
    }
  },

  computed: {
    sortedStateNames() {
      return Object.keys(this.politiciansByState).sort()
    },

    politiciansByState() {
      const politiciansByState = {}

      for (let pol of politicians) {
        if (!politiciansByState[pol.state]) {
          politiciansByState[pol.state] = []
        }

        politiciansByState[pol.state].push(pol)
      }

      return politiciansByState
    },

    houseCRACount() {
      return politicians.filter(p => p.organization === 'House' && p.yesOnCRA).length
    },

    introHTML() {
      const totalVotesNeeded = 218
      return this.$lt('intro_html', {
        totalVotes: totalVotesNeeded,
        craCount: this.houseCRACount,
        votesNeeded: totalVotesNeeded - this.houseCRACount
      })
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.scoreboard.all.${key}`, vars)
    },

    sectionId(name) {
      return name.toLowerCase().replace(/\s/g, '-')
    },

    scrollToTop() {
      smoothScrollTo(0, 0, 500)
    }
  }
}
</script>
