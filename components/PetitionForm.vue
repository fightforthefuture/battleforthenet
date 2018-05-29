<style lang="scss">
.petition-form {
  .petition-copy {
    font-size: 2.7rem;
    line-height: 1.5;
    color: #fff;
    float: left;
    width: 60%;

    @include big-screen {
      padding-bottom: 60px;
      background-image: url('~/assets/images/arrow.svg');
      background-repeat: no-repeat;
      background-position: bottom right;
      background-size: 120px auto;
    }

    p {
      margin: 0;
    }

    strong {
      color: $header-color;
      font-weight: normal;
    }
  }

  form {
    width: 35%;
    float: right;

    .flex-row {
      margin-bottom: 0;
    }

    input {
      margin-bottom: 0.6rem;
    }

    input.address {
      width: 64%;
      margin-right: 2%;
    }

    input.zip-code {
      width: 34%;
    }

    .letter {
      label {
        color: #777;
        font-family: $title-font;
        font-weight: bold;
        font-size: 1.7rem;
        content: "Letter:";
        background-color: #fff;
        display: block;
        border-radius: $border-radius $border-radius 0 0;
        padding: 1rem 1rem 0;
      }

      textarea {
        min-width: 26.5rem;
        height: 10rem;
        border-radius: 0;
      }

      a.clear {
        background-color: #ccc;
        color: #999;
        font-family: $title-font;
        font-weight: bold;
        text-transform: uppercase;
        display: block;
        text-decoration: none;
        font-size: 1.2rem;
        text-align: center;
        border-radius: 0 0 $border-radius $border-radius;
        margin: -0.65rem 0 .6rem;
        padding: .5rem;

        &:hover {
          color: darken(#999, 10%);
          background-color: darken(#ccc, 10%);
          transition: background-color .1s;
        }
      }
    }

    .btn {
      font-size: 1.8rem;
      margin: 0;
    }

    .disclaimer {
      // min-height: 80px;
      animation: fade-in .2s;
    }
  }

  @include small-screen {
    .petition-copy,
    form {
      float: none;
      width: auto;
    }

    form {
      margin-bottom: 3rem;

      input.name {
        width: 49%;
        margin-right: 2%;
      }

      input.email {
        width: 49%;
      }

      textarea {
        min-width: none;
      }
    }
  }
}
</style>

<template>
  <div class="petition-form clearfix">
    <form @submit.prevent="submitForm()">
      <input v-model.trim="name" type="text" :placeholder="$lt('name_placeholder')" required class="name">
      <input v-model.trim="email" type="email" :placeholder="$lt('email_placeholder')" required class="email">
      <input v-model.trim="address" type="text" :placeholder="$lt('address_placeholder')" required class="address">
      <input v-model.trim="zipCode" type="tel" :placeholder="$lt('zip_placeholder')" required class="zip-code">
      <input v-model.trim="phone" type="tel" :placeholder="$lt('phone_placeholder')">
      <div class="letter">
        <label>{{ $lt('letter_placeholder') }}</label>
        <textarea v-model="comments" ref="comments"></textarea>
        <a href="#" class="clear" @click.prevent="clearComments()">{{ $lt('clear_comments') }}</a>
      </div>
      <button class="btn btn-block btn-large" :disabled="isSending">
        <span v-if="isSending">{{ $lt('button_loading') }}</span>
        <span v-else>{{ $lt('button_cta') }}</span>
      </button>
      <no-ssr>
        <disclaimer :sms="true"></disclaimer>
      </no-ssr>
    </form>
    <div class="petition-copy" v-html="$t('pages.index.intro_html')"></div>
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
