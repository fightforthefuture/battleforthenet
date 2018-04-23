<style lang="scss" scoped>
.petition-form {
  .petition-copy {
    font-size: 2.7rem;
    line-height: 1.5;
    color: #fff;
    float: left;
    width: 50rem;

    @media screen and (min-width: $PAGE_WIDTH) {
      padding-bottom: 10rem;
      background-image: url(/images/red-arrow.png);
      background-repeat: no-repeat;
      background-position: 30rem 35rem;
    }

    strong {
      color: $header-color;
      font-weight: normal;
    }
  }

  form {
    width: 26.5rem;
    float: right;

    .flex-row {
      margin-bottom: 0;
    }

    input.address {
      flex: 2;
    }

    input {
      margin-bottom: 0.6rem;
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
        height: 13rem;
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

  @media screen and (max-width: $PAGE_WIDTH) {
    .petition-copy,
    form {
      float: none;
      width: auto;
    }

    form {
      margin-bottom: 3rem;

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
      <input v-model.trim="name" type="text" placeholder="Name*" required>
      <input v-model.trim="email" type="email" placeholder="E-mail*" required>
      <div class="flex-row">
        <input v-model.trim="address" class="address" type="text" placeholder="Address*" required>
        <input v-model.trim="zipCode" class="zip-code" type="tel" placeholder="Zip*" required>
      </div>
      <input v-model.trim="phone" type="tel" placeholder="Phone # (for text list)">
      <div class="letter">
        <label>Letter:</label>
        <textarea v-model="comments" ref="comments"></textarea>
        <a href="#" class="clear" @click.prevent="clearComments()">Clear and write your own</a>
      </div>
      <button class="btn btn-block btn-large" :disabled="isSending">
        <span v-if="isSending">Saving...</span>
        <span v-else>Write Congress</span>
      </button>
      <no-ssr>
        <disclaimer></disclaimer>
      </no-ssr>
    </form>
    <div class="petition-copy">
      The FCC voted to kill net neutrality and let ISPs like Comcast ruin the web with throttling, censorship, and new fees. Congress has 60 legislative days to overrule them and save the Internet using the Congressional Review Act (CRA), but we still need #OneMoreVote to win in the Senate. <strong>Can you write Congress now?</strong>
    </div>
    <modal v-if="modalVisible">
      <call-form :in-modal="true"></call-form>
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { sendToMothership } from '~/assets/js/helpers'
import CallForm from '~/components/CallForm'

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
      comments: `The FCC vote to destroy the Net Neutrality protections on Dec. 14 cannot stand.

I’m calling on you to work with your colleagues to use the Congressional Review Act to pass a "resolution of disapproval" reversing the FCC's vote.

The FCC's Dec. 14 decision willfully ignored the outcry from tens of millions of people, and it abdicated the FCC's responsibility to protect the internet from ISP blocking and discrimination. The FCC has injured our economy and free speech in just one action, all without so much as a single public hearing.

We need members of Congress to stand up for the open internet and for the digital civil rights of their constituents now. Please co-sponsor, sign the discharge petition, and vote for the CRA to pass a Resolution of Disapproval overturning the FCC's December 14 "Restoring Internet Freedom" vote.

Thank you.`
    }
  },

  computed: {
    ...mapState(['org']),

    actionComment() {
      return `${this.comments}\n\n(The sender of this message generated it using tools available at BattleForTheNet.com on ${new Date()}.)`
    }
  },

  methods: {
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
          an_petition_id: "58171536-6183-4e5b-81c5-0d59d7870399",
          action_comment: this.actionComment
        })

        this.$trackEvent('petition_form', 'submit')
        this.resetForm()
        this.modalVisible = true
      }
      catch (err) {
        self.isSending = false
        self.errorMessage = "That didn't work for some reason :("
      }
    },

    resetForm() {
      this.isSending = false
    }
  }
}
</script>
