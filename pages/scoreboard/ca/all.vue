<style lang="scss">
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
      </div>
    </section>
    <section v-for="org in organizations" :key="org" :id="sectionId(org)">
      <ScoreboardGroup :title="org" :politicians="politicians[org]" class="container" />
    </section>
    <persistent-button><a class="btn" href="#" @click.prevent="scrollToTop()">{{ $lt('persistent_button') }}</a></persistent-button>
  </div>
</template>

<script>
import axios from 'axios'
import { createMetaTags, smoothScrollTo } from '~/assets/js/helpers'
import ScoreboardGroup from '~/components/ScoreboardGroup'
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
      const { data } = await axios.get('https://data.battleforthenet.com/scoreboard/california.json')
      politicians = data
      console.log(data)
    }
    catch (error) {
      //
      console.error(error)
    }

    const politiciansByOrg = {}

    for (let org of [ 'Senate', 'Assembly' ]) {
      politiciansByOrg[org] = politicians.filter(p => p.organization === org)
    }

    return {
      politicians: politiciansByOrg
    }
  },

  computed: {
    organizations() {
      return [ 'Senate', 'Assembly' ]
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.scoreboard.ca.all.${key}`, vars)
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
