<style lang="scss" scoped>
form {
  display: flex;

  input, button {
    width: 33%;
    flex-grow: 1;
  }

  input {
    margin-right: 0.5rem;
  }

  button {
    font-size: 2rem;

    span {
      background-image: url('~/assets/images/phone.svg');
      background-repeat: no-repeat;
      background-size: 2.2rem auto;
      background-position: bottom left;
      padding-left: 2.5rem;
    }
  }

  @include big-screen {
    button, input.zip {
      width: 25%;
      flex: none;
    }
  }
}
</style>

<template>
  <div class="call-form">
    <div v-if="!hasCalled || !inModal">
      <div v-if="inModal">
        <h2 v-if="inModal"><strong>Thanks!</strong> Can you call?</h2>
        <p>We'll provide you with a suggestion of what to say and connect you directly with your lawmaker's office.</p>
      </div>
      <form @submit.prevent="submitForm()">
        <input class="phone" type="tel" placeholder="Phone Number" v-model.trim="phone" required>
        <input class="zip" type="tel" placeholder="Zip Code" v-model.trim="zipCode" required>
        <button class="btn btn-cta">
          <span v-if="isSending">Saving...</span>
          <span v-else>Call</span>
        </button>
      </form>
      <p class="disclaimer">
        <small>Your number will only be used for this call and will never be shared with third parties. <a href="/privacy" target="_blank">Privacy Policy</a></small>
      </p>
    </div>

    <!-- Show call script after form has been submitted -->
    <div v-if="hasCalled">
      <!-- If we're in a modal already, put the call script right here -->
      <call-script v-if="inModal" :page="page"></call-script>
      <!-- Otherwise, put the call script inside a modal -->
      <modal v-else-if="modalVisible">
        <call-script :page="page"></call-script>
      </modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { pingCounter, postFormData } from '~/assets/js/helpers'
import CallScript from '~/components/CallScript'
import settings from '~/assets/data/callpower.json'

export default {
  components: {
    CallScript
  },

  props: {
    inModal: {
      type: Boolean,
      default: false
    },

    page: {
      type: String,
      default: 'home'
    },

    defaultZip: {
      type: String,
      default: null
    },

    defaultPhone: {
      type: String,
      default: null
    }
  },

  watch: {
    zipCode(newValue) {
      if (newValue.length >= 5) {
        this.geocodeZip()
      }
    }
  },

  data() {
    return {
      phone: this.defaultPhone,
      zipCode: this.defaultZip,
      stateCode: null,
      isSending: false,
      hasCalled: false,
      modalVisible: false,
      errorMessage: null
    }
  },

  created() {
    if (this.zipCode) {
      this.geocodeZip()
    }
  },

  computed: {
    campaignData() {
      return settings[`${this.page}Page`]
    },

    stateCampaign() {
      if (this.stateCode) {
        for (let campaign of this.campaignData.stateCampaigns) {
          if (campaign.states.includes(this.stateCode)) {
            return campaign.id
          }
        }
      }
    },

    campaign() {
      if (this.$route.query.campaign) {
        return this.$route.query.campaign
      }
      else if (this.stateCampaign) {
        return this.stateCampaign
      }
      else {
        return this.campaignData.defaultCampaign
      }
    },

    campaignId() {
      switch (this.campaign) {
        case 'daily':
          return 1
        case 'california':
          return 'California-SB-822'
        case 'fftf':
        default:
          return this.campaign
      }
    },

    callPowerURL() {
      if (this.campaign === 'daily') {
        return "https://demandprogress.callpower.org/call/create"
      }
      else {
        return "https://call-congress.fightforthefuture.org/create"
      }
    }
  },

  methods: {
    async submitForm() {
      this.isSending = true

      try {
        const { data } = await postFormData(this.callPowerURL,{
          campaignId: this.campaignId,
          userPhone: this.phone,
          userLocation: this.zipCode
        })

        this.isSending = false
        this.hasCalled = true
        this.modalVisible = true
        this.$trackEvent('call_form', 'submit')
        pingCounter('call')
      }
      catch (err) {
        this.isSending = false
        this.errorMessage = "That didn't work for some reason :("
      }
    },

    async geocodeZip() {
      try {
        const { data } = await axios.get(`https://geo.battleforthenet.com/zip/${this.zipCode.substring(0, 5)}.json`)
        this.stateCode = data.state_code
      }
      catch (error) {
        // Invalid zip code
        this.stateCode = null
      }
    }
  }
}
</script>
