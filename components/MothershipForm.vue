<style lang="scss" scoped>
form {
  margin: auto;
  width: 96%;

  .row {
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    margin-bottom: 10px;

    input {
      width: 49%;
      margin-right: 2%;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .large-audience {
    text-align: left;
    font-size: 96%;
    margin: 10px 0;

    label {
      margin-bottom: 4px;
      display: block;
    }
  }
}
</style>

<script>
import { sendToMothership } from '~/assets/js/helpers'
import { mapMutations } from 'vuex'
import ShareModal from '~/components/ShareModal'

export default {
  components: {
    ShareModal
  },

  props: {
    anPetitionId: String,
    anTags: String,
    org: {
      type: String,
      default: 'fftf'
    }
  },

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

  computed: {
    anTagsArray() {
      if (this.anTags) {
        return this.anTags.split(',').map(t => t.trim())
      }
      return []
    }
  },

  // mounted() {
  //   this.showModal()
  // },

  methods: {
    ...mapMutations(['showModal']),

    async submitForm() {
      this.isSending = true

      try {
        const response = await sendToMothership({
          member: {
            first_name: this.name,
            email: this.email,
            postcode: this.zipCode,
            phone_number: this.phone,
            country: 'US'
          },
          hp_enabled: 'true',
          guard: '',
          contact_congress: 0,
          org: this.org,
          an_tags: JSON.stringify(this.anTagsArray),
          an_petition_id: this.anPetitionId,
          // volunteer: self.hasLargeAudience,
          // action_comment: self.actionComment
        })

        this.resetForm()
        this.showModal()
        // trackEvent('signup', 'success', 'Step 4 - Sign Up');
      }
      catch (err) {
        self.isSending = false
        self.errorMessage = "That didn't work for some reason :("
      }
    },

    resetForm() {
      this.phone = null
      this.name = null
      this.email = null
      this.zipCode = null
      // this.hasLargeAudience = false;
      // this.actionComment = null;
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
      <div class="row">
        <input type="text" placeholder="Name*" required v-model="name">
        <input type="email" placeholder="Email*" required v-model="email">
      </div>
      <div class="row">
        <input type="tel" placeholder="ZIP Code*" required v-model="zipCode">
        <input type="tel" placeholder="Phone #" v-model="phone">
      </div>
      <button class="btn btn-large btn-block" :disabled="isSending">
        <span v-if="isSending" v-cloak>Joining...</span>
        <span v-else>Sign Up</span>
      </button>
      <div class="disclaimer">
        <small><a href="https://www.fightforthefuture.org/">Fight for the Future</a> will email you updates, and you can unsubscribe at any time. If you enter your number (it's optional) we may follow up by SMS (message &amp; data rates apply.) You can always text STOP to stop receiving messages. <a href="https://www.battleforthenet.com/privacy/">Privacy Policy</a></small>
      </div>
    </form>
    <share-modal></share-modal>
  </div>
</template>