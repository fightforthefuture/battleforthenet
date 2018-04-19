<style lang="scss" scoped>
.petition-form {
  // display: flex;

  .petition-copy {
    font-size: 27px;
    line-height: 1.5;
    color: #fff;
    float: left;
    width: 500px;

    @media screen and (min-width: $PAGE_WIDTH) {
      padding-bottom: 100px;
      background-image: url(/images/red-arrow.png);
      background-repeat: no-repeat;
      background-position: 300px 350px;
    }

    strong {
      color: $header-color;
      font-weight: normal;
    }
  }

  form {
    width: 265px;
    float: right;

    .flex-row input {
      flex: 1;
      margin-right: 5px;

      &.address {
        flex: 2;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    input {
      margin-bottom: 6px;
    }

    .letter {
      label {
        color: #777;
        font-family: $title-font;
        font-weight: bold;
        font-size: 17px;
        content: "Letter:";
        background-color: #fff;
        display: block;
        border-radius: 4px 4px 0 0;
        padding: 10px 10px 0;
      }

      textarea {
        min-width: 265px;
        height: 130px;
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
        font-size: 12px;
        text-align: center;
        border-radius: 0 0 4px 4px;
        margin: -6px 0 6px;
        padding: 5px;

        &:hover {
          color: darken(#999, 10%);
          background-color: darken(#ccc, 10%);
          transition: background-color .1s;
        }
      }
    }

    .btn {
      font-size: 18px;
      margin: 0;
    }

    .disclaimer {
      // min-height: 80px;
      animation: fade-in .2s;
    }
  }

  @media screen and (max-width: $PAGE_WIDTH) {
    .petition-copy {
      float: none;
      width: auto;
      font-size: 20px;
    }

    form {
      float: none;
      width: auto;
      margin-bottom: 20px;
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
        <p class="disclaimer" slot="placeholder"></p>
        <p class="disclaimer">
          <small v-if="org == 'fftf'">
            <a target="_blank" href="https://www.fightforthefuture.org">Fight for the Future</a> will email you updates, and you can unsubscribe at any time. If you enter your number (it's optional) we will follow up by SMS. Message &amp; data rates apply. You can always text STOP to stop receiving messages.
            <a target="_blank" href="/privacy">Privacy Policy</a>
          </small>
          <small v-else>
            <a v-if="org == 'dp'" target="_blank" href="https://www.demandprogress.org">Demand Progress</a>
            <a v-else-if="org == 'fp'" target="_blank" href="https://www.freepress.net">Free Press</a>
            <a v-else target="_blank" href="https://www.fightforthefuture.org">Fight for the Future</a>
            will contact you about future campaigns.
            <a target="_blank" href="/privacy">Privacy Policy</a>
          </small>
        </p>
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
import moment from 'moment'
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
      const date = moment().format('dddd, MMMM Do YYYY')
      const time = moment().format('h:mm:ss a')
      return `${this.comments}\n\n(The sender of this message generated it using tools available at BattleForTheNet.com on ${date} at ${time}.)`
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