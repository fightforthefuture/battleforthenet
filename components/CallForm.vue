<style lang="scss" scoped>
form {
  display: flex;

  input {
    flex: 1;
    margin-right: 5px;
  }

  button {
    font-size: 20px;
    width: 30%;

    span {
      background-image: url('~/assets/images/phone.svg');
      background-repeat: no-repeat;
      background-size: 22px auto;
      background-position: bottom left;
      padding-left: 25px;
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
        <input type="tel" placeholder="Enter your phone #" v-model.trim="phone">
        <button class="btn">
          <span v-if="isSending">Saving...</span>
          <span v-else>Call</span>
        </button>
      </form>
      <p>
        (We’ll connect you and provide a suggested script of what to say. <a href="/privacy" target="_blank">Privacy Policy</a>)
      </p>
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
import { postFormData } from '~/assets/js/helpers'
import CallScript from '~/components/CallScript'

export default {
  components: {
    CallScript
  },

  props: {
    inModal: {
      type: Boolean,
      default: false
    },

    defaultCampaign: {
      type: String,
      default: 'RED_ALERT_BattleForTheNet_Call_2RSens_House'
    }
  },

  data() {
    return {
      phone: null,
      isSending: false,
      hasCalled: false,
      modalVisible: false,
      errorMessage: null
    }
  },

  computed: {
    campaign() {
      return this.$route.query.campaign || this.defaultCampaign
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
          userPhone: this.phone
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
    }
  }
}
</script>
