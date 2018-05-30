<style lang="scss">
.petition-form {
  > form {
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

    .btn-large {
      font-size: 2.6rem;
      margin: 0;
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
}
</style>

<template>
  <div class="petition-form">
    <form @submit.prevent="submitForm()">
      <div class="flex-row">
        <input v-model.trim="name" type="text" :placeholder="$lt('name_placeholder')" required class="name">
        <input v-model.trim="email" type="email" :placeholder="$lt('email_placeholder')" required class="email">
      </div>
      <div class="flex-row">
        <input v-model.trim="address" type="text" :placeholder="$lt('address_placeholder')" required class="address">
        <input v-model.trim="zipCode" type="tel" :placeholder="$lt('zip_placeholder')" required class="zip-code">
        <input v-model.trim="phone" type="tel" :placeholder="$lt('phone_placeholder')">
      </div>
      <div class="letter">
        <textarea v-model="comments" ref="comments"></textarea>
        <a href="#" class="clear btn" @click.prevent="clearComments()">{{ $lt('clear_comments') }}</a>
      </div>
      <button class="btn btn-block btn-large btn-cta" :disabled="isSending">
        <span v-if="isSending">{{ $lt('button_loading') }}</span>
        <span v-else>{{ $lt('button_cta') }}</span>
      </button>
      <no-ssr>
        <disclaimer :sms="true"></disclaimer>
      </no-ssr>
    </form>
    <modal v-if="modalVisible">
      <call-form :in-modal="true" :default-zip="zipCode" :default-phone="phone"></call-form>
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { pingCounter, sendToMothership, startTextFlow } from '~/assets/js/helpers'
import CallForm from '~/components/CallForm'

// battle-for-the-net-action-4
const petitionId = '25488448-4124-4359-8873-d1ef731ea5f4'

export default {
  components: {
    CallForm
  },

  data() {
    return {
      isSending: false,
      modalVisible: false,
      name: null,
      email: null,
      address: null,
      zipCode: null,
      phone: null,
      comments: this.$lt('default_letter')
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
    ...mapState(['org']),

    actionComment() {
      return `${this.comments}\n\n(The sender of this message generated it using tools available at BattleForTheNet.com on ${new Date()}.)`
    }
  },

  methods: {
    $lt(key) {
      return this.$t(`pages.index.form.${key}`)
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

        this.$trackEvent('petition_form', 'submit')
        this.isSending = false
        this.modalVisible = true

        if (this.phone && this.org === 'fftf') {
          this.startTextFlow()
        }

        pingCounter('email')
      }
      catch (err) {
        self.isSending = false
        self.errorMessage = "That didn't work for some reason :("
      }
    },

    resetForm() {
      this.isSending = false
      this.name = null
      this.email = null
      this.address = null
      this.zipCode = null
      this.phone = null
      this.comments = this.$lt('default_letter')
    },

    startTextFlow() {
      startTextFlow({
        flow: '9a1fe2d7-0647-4133-88ec-6bf7097228e8',
        phone: this.phone
      })
    }
  }
}
</script>
