<template>
  <form @submit.prevent="submitForm()">
    <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
    <div class="flex-row">
      <input type="text" v-model="street" :placeholder="$lt('address_placeholder')" required class="street">
      <input type="tel" v-model="zipCode" :placeholder="$lt('zip_placeholder')" required class="zip">
    </div>
    <div class="flex-row">
      <button :class="btnClass" :disabled="isLoading">
        <span v-if="!isLoading">{{ $lt('cta_button') }}</span>
        <span v-else>{{ $lt('loading_button') }}</span>
      </button>
    </div>
    <p class="disclaimer">
      <small>{{ $lt('disclaimer') }}</small>
    </p>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    btnClass: {
      type: String,
      default: 'btn'
    }
  },

  data() {
    return {
      isLoading: false,
      errorMessage: null
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

    street: {
      get() {
        return this.$store.state.streetAddress
      },

      set(value) {
        this.$store.commit('setStreetAddress', value)
      }
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`components.ScoreboardForm.${key}`, vars)
    },

    async submitForm() {
      this.$trackEvent('scoreboard_form', 'submit')
      this.isLoading = true
      this.errorMessage = null

      const data = await this.fetchReps()

      if (data.rep && data.rep.bioguide_id) {
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
        const { data } = await axios.get(`https://07myr1bkfa.execute-api.us-east-1.amazonaws.com/v1/reps?address=${encodeURIComponent(address)}`)
        return data
      }
      catch (error) {
        return {}
      }
    }
  }
}
</script>
