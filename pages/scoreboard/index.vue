<style lang="scss">
.scoreboard-index {
  .page-header {
    background-color: $alt-bg-color;
    min-height: 100vh;

    .intro {
      margin-bottom: 2rem;
    }

    input.street {
      flex: 2;
    }
  }

  .view-all {
    margin: 10rem 0;

    a {
      color: #594686;
      text-transform: uppercase;

      &:hover {
        color: lighten(#594686, 10%);
      }
    }
  }
}
</style>

<template>
  <div class="scoreboard-index">
    <section class="page-header fill-height">
      <div class="container">
        <h2>{{ $lt('title') }}</h2>
        <div class="intro" v-html="$lt('intro_html')"></div>
        <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
        <form @submit.prevent="submitForm()">
          <div class="flex-row">
            <input type="text" v-model="street" :placeholder="$lt('address_placeholder')" required class="street">
            <input type="tel" v-model="zipCode" :placeholder="$lt('zip_placeholder')" required class="zip">
          </div>
          <div class="flex-row">
            <button class="btn btn-large btn-cta" :disabled="isLoading">
              <span v-if="!isLoading">{{ $lt('cta_button') }}</span>
              <span v-else>{{ $lt('loading_button') }}</span>
            </button>
          </div>
          <p class="disclaimer">
            <small>{{ $lt('disclaimer') }}</small>
          </p>
        </form>
        <div class="view-all">
          <nuxt-link to="/scoreboard/all">{{ $lt('view_all') }}</nuxt-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      street: null,
      zipCode: null,
      isLoading: false,
      errorMessage: null
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.scoreboard.index.${key}`, vars)
    },

    async submitForm() {
      this.isLoading = true
      this.errorMessage = null

      const data = await this.fetchReps()

      if (data.rep) {
        console.log(data)
        this.$router.push({
          name: 'scoreboard-id',
          params: {
            id: data.rep.bioguide_id
          }
        })
      }
      else {
        this.errorMessage = this.$lt('error_rep_not_found')
      }

      this.isLoading = false
    },

    async fetchReps() {
      try {
        const address = `${this.street} ${this.zipCode}`
        const { data } = await axios.get(`https://5spfbwv3p5.execute-api.us-east-1.amazonaws.com/v1/reps?address=${encodeURIComponent(address)}`)
        return data
      }
      catch (error) {
        return {}
      }
    }
  }
}
</script>
