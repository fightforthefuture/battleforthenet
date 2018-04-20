<script>
import axios from 'axios'
const petitionId = '11f84b38-e65b-4259-b0ae-e879a4044ca9'

export default {
  data() {
    return {
      errorMessage: null,
      name: null,
      email: null,
      phone: null,
      zipCode: null,
      isSending: false,
      modalVisible: false
    }
  },

  methods: {
    async submitForm() {
      this.isSending = true
      // this.$ga.event('form', 'submitted', 'Sign the Letter')

      try {
        const { data } = await axios.post(
          `https://fv8xpw9hri.execute-api.us-east-1.amazonaws.com/v1/petitions/${petitionId}/signatures`,
          {
            name: this.name,
            email: this.email,
            phone: this.phone,
            zip_code: this.zipCode,
            tags: 'net-neutrality'
          }
        )

        this.resetForm()
        this.modalVisible = true
      }
      catch (error) {
        this.isSending = false
        this.errorMessage = "That didn't work for some reason :("
      }
    },

    resetForm() {
      this.phone = null
      this.name = null
      this.email = null
      this.zipCode = null
      this.isSending = false
      this.errorMessage = null
    }
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="submitForm()">
      <p v-cloak v-if="errorMessage" class="error"><strong>{{ errorMessage }}</strong></p>
      <div class="flex-row">
        <input type="text" placeholder="Name*" required v-model="name">
        <input type="email" placeholder="Email*" required v-model="email">
      </div>
      <div class="flex-row">
        <input type="tel" placeholder="ZIP Code*" required v-model="zipCode">
        <input type="tel" placeholder="Phone #" v-model="phone">
      </div>
      <button class="btn btn-large btn-block" :disabled="isSending">
        <span v-if="isSending" v-cloak>Joining...</span>
        <span v-else>Sign Up</span>
      </button>
      <disclaimer></disclaimer>
    </form>
    <modal v-if="modalVisible">
      <h2>Thanks so much for your support!</h2>
      <p>Now, can you help us spread the word?</p>
      <div class="share">
        <facebook-button url="https://shpg.org/103/186665/facebook"></facebook-button>
        &nbsp;
        <twitter-button url="https://shpg.org/103/186666/twitter"></twitter-button>
      </div>
      <br>
    </modal>
  </div>
</template>
