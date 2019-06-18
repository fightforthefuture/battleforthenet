<style lang="scss">
.petition-form {
  margin: 3rem auto 0;

  @include big-screen {
    border: 1px solid #2e273e;
    border-radius: $border-radius;
    padding: 3rem;
  }

  .flex-row {
    margin-bottom: 0.8rem;

    > * {
      margin-right: 0.8rem;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  label {
    display: block;
    margin-bottom: 0.3rem;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: left;
    text-transform: uppercase;
  }

  input, textarea {
    font-family: $body-font;
    font-weight: 300;
    padding: 1rem 1.5rem;

    &::placeholder {
      // color: #201b2c;
      font-weight: 300;
    }
  }

  input.zip-code {
    flex-grow: 0.5;
  }

  .letter {
    position: relative;
    margin-bottom: 0.8rem;

    textarea {
      min-width: 100%;
      max-width: 100%;
      min-height: 5rem;
      height: 5rem;
      padding-right: 12rem;
    }

    a.clear {
      position: absolute;
      right: 2rem;
      bottom: 1.6rem;
      background-color: #ebe7f4;
      color: #89819d;
      font-size: 1.2rem;
      margin: 0;
      letter-spacing: 0;

      &:hover {
        background-color: darken(#ebe7f4, 5%);
      }
    }
  }

  .biz-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;

    label {
      font-weight: bold;
      text-align: left;
      padding: 0 .5rem;
    }
  }

  .btn-large {
    font-size: 2.6rem;
    margin: 1.2rem 0 0 0;
    letter-spacing: 0.3rem;
  }

  .disclaimer {
    // min-height: 80px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    animation: fade-in .2s;
  }
}
</style>

<template>
  <div>
    <div v-if="!hasSigned || !inModal">
      <h2 v-if="title">{{ title }}</h2>
      <form class="petition-form" @submit.prevent="submitForm()">
        <div class="flex-row">
          <div>
            <no-ssr><label v-if="showLabels">{{ $lt('name_placeholder') }}</label></no-ssr>
            <input v-model.trim="name" type="text"
                   :placeholder="showLabels ? 'First Last' : $lt('name_placeholder')"
                   required class="name">
          </div>
          <div>
            <no-ssr><label v-if="showLabels">{{ $lt('email_placeholder') }}</label></no-ssr>
            <input v-model.trim="email" type="email"
                   :placeholder="showLabels ? 'me@example.com' : $lt('email_placeholder')"
                   required class="email">
          </div>
        </div>
        <div class="flex-row">
          <div>
            <no-ssr><label v-if="showLabels">{{ $lt('address_placeholder') }}</label></no-ssr>
            <input v-model.trim="address" type="text"
                   :placeholder="showLabels ? '# Street' : $lt('address_placeholder')"
                   required class="address">
          </div>
          <div>
            <no-ssr><label v-if="showLabels">{{ $lt('zip_placeholder') }}</label></no-ssr>
            <input v-model.trim="zipCode" type="tel"
                   :placeholder="showLabels ? '55555' : $lt('zip_placeholder')"
                   required class="zip-code">
          </div>
          <div>
            <no-ssr><label v-if="showLabels">{{ $lt('phone_label') }}</label></no-ssr>
            <input v-model.trim="phone" type="tel"
                   :placeholder="showLabels ? '222-333-4444' : $lt('phone_placeholder')">
          </div>
        </div>
        <div class="letter">
          <no-ssr><label v-if="showLabels">{{ $lt('comments_label') }}</label></no-ssr>
          <textarea v-model="comments" ref="comments"></textarea>
          <a href="#" class="clear btn" @click.prevent="clearComments()">{{ $lt('clear_comments') }}</a>
        </div>
        <div class="biz-row" v-show="false">
          <label>{{ $lt('business_owner_label') }}</label>
          <fancy-toggle :on="isBusinessOwner" @change="setBusinessOwner"></fancy-toggle>
        </div>
        <div v-if="isBusinessOwner" class="flex-row">
          <input v-model.trim="companyName" type="text" :placeholder="$lt('company_name_placeholder')">
          <input v-model.trim="companyURL" type="text" :placeholder="$lt('company_url_placeholder')">
        </div>
        <button class="btn btn-block btn-large btn-cta" :disabled="isSending">
          <span v-if="isSending">{{ $lt('button_loading') }}</span>
          <span v-else>{{ $lt('button_cta') }}</span>
        </button>
        <no-ssr>
          <disclaimer :sms="true"></disclaimer>
        </no-ssr>
      </form>
    </div>

    <div v-if="hasSigned">
      <CallForm v-if="inModal" :in-modal="true" />
      <modal v-else-if="modalVisible">
        <RepInterstitial v-if="rep" :rep="rep" />
        <CallForm v-else :in-modal="true" />
      </modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchRepScoreboard, pingCounter, sendToMothership, startTextFlow } from '~/assets/js/helpers'
import CallForm from '~/components/CallForm'
import FancyToggle from '~/components/FancyToggle'
import RepInterstitial from '~/components/RepInterstitial'
import axios from 'axios'

// New BFTN petition for 2019
const petitionId = '8305bb2c-2e17-47eb-91ad-28b0ce02e353'

// BFNN petition
const bizPetitionId = '94ac8142-99b8-411f-83af-133d02649af1'

export default {
  components: {
    CallForm,
    FancyToggle,
    RepInterstitial
  },

  props: {
    title: String,

    inModal: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      isSending: false,
      hasSigned: false,
      modalVisible: false,
      name: null,
      email: null,
      comments: this.$lt('default_letter'),
      isBusinessOwner: false,
      companyName: null,
      companyURL: null,
      rep: null
    }
  },

  watch: {
    modalVisible(isVisible) {
      if (!isVisible) {
        this.resetForm()
      }
    }
  },

  computed: {
    ...mapState(['org', 'testVariant']),

    showLabels() { return this.$store.state.testVariant === 'a' ? true : false },

    actionComment() {
      return `${this.comments}\n\n(The sender of this message generated it using tools available at BattleForTheNet.com on ${new Date()}.)`
    },

    zipCode: {
      get() {
        return this.$store.state.zipCode
      },

      set(value) {
        this.$store.commit('setZipCode', value)
      }
    },

    phone: {
      get() {
        return this.$store.state.phone
      },

      set(value) {
        this.$store.commit('setPhone', value)
      }
    },

    address: {
      get() {
        return this.$store.state.streetAddress
      },

      set(value) {
        this.$store.commit('setStreetAddress', value)
      }
    }
  },

  methods: {
    $lt(key) {
      return this.$t(`pages.index.form.${key}`)
    },

    setBusinessOwner(flag) {
      this.isBusinessOwner = flag;
    },

    clearComments() {
      this.$trackEvent('clear_comments_button', 'click')
      this.comments = null
      this.$refs.comments.focus()
    },

    async submitForm() {
      this.isSending = true

      try {
        const response = await sendToMothership({
          subject: "Protect Net Neutrality!",
          member: {
            first_name: this.name,
            email: this.email,
            postcode: this.zipCode,
            phone_number: this.phone,
            street_address: this.address,
            country: 'US'
          },
          hp_enabled: 'true',
          guard: '',
          contact_congress: 1,
          fcc_ecfs_docket: "17-108",
          org: this.org,
          an_tags: "[\"net-neutrality\"]",
          an_petition_id: petitionId,
          action_comment: this.comments
        })

/* Quick hack to disable incorrect rep data
        if (!this.inModal) {
          this.rep = await fetchRepScoreboard({
            street: this.address,
            zip: this.zipCode
          })
        }
        */

        this.$trackEvent(`petition_form_${this.showLabels ? 'labels' : 'placeholders'}`, 'submit')
        this.isSending = false
        this.modalVisible = true
        this.hasSigned = true

        if (this.phone && this.org === 'fftf') {
          this.startTextFlow()
        }

        if (this.companyName && this.companyURL) {
          this.signBusinessPetition()
        }

        pingCounter('email')
      }
      catch (err) {
        self.isSending = false
        self.errorMessage = "That didn't work for some reason :("
      }
    },

    async signBusinessPetition() {
      return axios.post(
        `https://fv8xpw9hri.execute-api.us-east-1.amazonaws.com/v1/petitions/${bizPetitionId}/signatures`,
        {
          name: this.name,
          email: this.email,
          phone: this.phone,
          zip_code: this.zipCode,
          comments: this.comments,
          custom: {
            company: this.companyName,
            company_url: this.companyURL,
          },
          tags: ['bfnn', 'net-neutrality'],
          source: this.$route.query.source
        }
      )
    },

    resetForm() {
      this.isSending = false
      this.name = null
      this.email = null
      this.address = null
      this.zipCode = null
      this.phone = null
      this.comments = this.$lt('default_letter')
      this.isBusinessOwner = false
      this.companyName = null
      this.companyURL = null
    },

    startTextFlow() {
      startTextFlow({
        opt_in_path: 'OP5953C0BBD1870756CE4041DD8F00C7C1',
        phone: this.phone,
        name: this.name,
        email: this.email,
        zip_code: this.zipCode,
        street: this.street
      })
    }
  }
}
</script>
