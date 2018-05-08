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
  <div class="call-form text-center">
    <div v-if="!hasCalled || !inModal">
      <h2 v-if="inModal">Thanks! Now can you call them?</h2>
      <p>The FCC voted to kill net neutrality and let ISPs like Comcast and Verizon ruin the Internet with throttling, censorship, and new fees. But the Senate is about to vote on a resolution to overrule them and save the Internet using the Congressional Review Act (CRA). We only need one more vote to win. <strong>Can you call Congress now?</strong></p>
      <form @submit.prevent="submitForm()">
        <input class="phone" type="tel" placeholder="Phone #" v-model.trim="phone" required>
        <input class="zip" type="tel" placeholder="Zip Code" v-model.trim="zipCode" required>
        <button class="btn">
          <span v-if="isSending">Saving...</span>
          <span v-else>Call</span>
        </button>
      </form>
<!--       <p>
        (We’ll connect you and provide a suggested script of what to say. <a href="/privacy" target="_blank">Privacy Policy</a>)
      </p> -->
      <p>Hi, Laila, the campaign ID is: <strong>{{ campaignId }}</strong></p>
    </div>

    <!-- Show call script after form has been submitted -->
    <div v-if="hasCalled">
      <!-- If we're in a modal already, put the call script right here -->
      <call-script v-if="inModal"></call-script>
      <!-- Otherwise, put the call script inside a modal -->
      <modal v-else-if="modalVisible">
        <call-script></call-script>
      </modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { postFormData } from '~/assets/js/helpers'
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
      if (this.page === 'call') {
        return settings.callPage
      }
      else {
        return settings.homePage
      }
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
