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
        <div class="intro" v-html="$lt('intro_html')"></div>
        <ScoreboardLegend />
        <div class="state-selector">
          <select v-model="selectedState">
            <option :value="null">{{ $lt('state_placeholder') }}</option>
            <option v-for="state in sortedStateNames" :key="state" :value="state">{{ state }}</option>
          </select>
        </div>
      </div>
    </section>
    <section v-for="state in sortedStateNames" :key="state" :id="sectionId(state)">
      <ScoreboardGroup :title="state" :politicians="politiciansByState[state]" class="container" />
    </section>
    <persistent-button>
      <a class="btn" href="#"
         @click.prevent="scrollToTop(); $trackClick('sticky_button_scoreboard');">
        {{ $lt('persistent_button') }}
      </a>
    </persistent-button>
  </div>
</template>

<script>
import axios from 'axios'
import states from '~/assets/data/states'
import { createMetaTags, smoothScrollTo } from '~/assets/js/helpers'
import ScoreboardGroup from '~/components/ScoreboardGroup'
import ScoreboardLegend from '~/components/ScoreboardLegend'
import PersistentButton from '~/components/PersistentButton'

export default {
  head() {
    return {
      title: this.$lt('document_title'),
      meta: createMetaTags({
        title: this.$t('pages.scoreboard.social.title'),
        description: this.$t('pages.scoreboard.social.description'),
        image: this.$t('pages.scoreboard.social.image'),
        url: this.$t('pages.scoreboard.social.url')
      })
    }
  },

  components: {
    ScoreboardGroup,
    ScoreboardLegend,
    PersistentButton
  },

  data() {
    return {
      selectedState: null
    }
  },

  async asyncData() {
    let politicians = []

    try {
      const { data } = await axios.get('https://data.battleforthenet.com/scoreboard/all.json')
      politicians = data
    }
    catch (error) {
      //
    }

    return {
      politicians: politicians
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

      for (let pol of this.politicians) {
        const key = states[pol.state]

        if (!politiciansByState[key]) {
          politiciansByState[key] = []
        }

        politiciansByState[key].push(pol)
      }

      return politiciansByState
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
