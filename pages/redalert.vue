<style lang="scss">
$body-font: open-sans, sans-serif;
$title-font: futura-pt-bold, $body-font;
$red: #ff0e0e;
$gray: #b7b7b7;

body {
  font-family: $body-font;
  padding-bottom: 8rem;
}

h1, h2, h3, .btn {
  font-family: $title-font;
}

h1 {
  font-size: 7rem;
  line-height: .9;

  @include mobile {
    font-size: 4.2rem;
  }
}

h2 {
  color: #111;
  font-size: 2.8rem;

  &:after {
    content: "";
    background-color: #111;
    height: 0.1rem;
    display: block;
    width: 3rem;
    margin: 2rem auto;
  }
}

img.rounded {
  border-radius: $border-radius;
}

.container {
  width: 600px;
}

.page-header {
  background: rgb(255,14,13);
  background: linear-gradient(177deg, rgba(255,14,13,1) 0%, rgba(222,6,6,1) 51%, rgba(198,0,0,1) 100%);
  color: #fff;
  padding: 3rem;
  position: relative;

  // arrow
  &:after {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(198, 0, 0, 0);
    border-top-color: #c60000;
    border-width: 2.5rem;
    margin-left: -2.5rem;
  }

  h1 {
    margin: 0;
    color: inherit;
  }

  img.logo {
    width: 7rem;
  }

  form .row {
    input {
      width: 32.5%;
      margin-right: 1%;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .btn {
    background-color: #000;
  }

  p.disclaimer {
    small, a {
      color: inherit;
    }
  }

  p.error {
    color: #000;
    font-weight: bold;
  }
}

section {
  padding: 6rem;

  @include mobile {
    padding: 3rem 0;
  }

  &:nth-child(odd) {
    background-color: #fff6f6;
  }

  p {
    font-weight: 300;
  }

  a {
    color: $red;
    text-decoration: none;

    &:hover {
      color: $red;
      text-decoration: underline;
    }
  }
}

.page-footer {
  text-align: center;
  font-size: 1.4rem;
  padding: 5rem;
  color: #222;

  h4 {
    font-family: $title-font;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
  }

  .logos {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    img {
      height: 3rem;
    }
  }

  p {
    margin: 0.5rem 0;
    font-weight: 300;
  }

  a {
    text-decoration: none;
    font-weight: bold;
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }
}

.red-alert {
  .persistent-button {
    left: 0;
    right: 0;
    bottom: 0;

    a {
      background: $red;
      color: #fff;
      text-decoration: none;
      font-family: futura-pt-bold, open-sans, sans-serif;
      font-weight: 700;
      text-align: center;
      padding: 2rem;
      font-size: 2.5rem;
      text-transform: uppercase;

      img {
        height: 2.7rem;
        margin-right: 1.3rem;
      }
    }
  }

  .modal {
    background-color: #fff;
    padding: 0;
    width: 600px;

    .close {
      color: #fff;
      top: 0;
    }

    header {
      background-color: #101010;
      border-radius: $border-radius $border-radius 0 0;

      h2 {
        color: #fff;
        margin: 0;
        padding-top: 2rem;
        font-size: 3.2rem;
      }
    }

    .modal-content {
      padding: 0 4rem 2rem;

      p {
        font-weight: 300;
        font-size: 1.4rem;
      }

      .btn {
        white-space: nowrap;

        @include mobile {
          white-space: normal;
        }
      }

      .or {
        font-family: $title-font;
        font-weight: 500;
        font-size: 1rem;
        color: $gray;
        margin: 1rem 0;
        position: relative;
        height: 1.5rem;

        &:before {
          content: "";
          background-color: #b7b7b7;
          height: 0.1rem;
          width: 100%;
          display: block;
          position: absolute;
          top: 50%;
        }

        span {
          background-color: #fff;
          position: absolute;
          top: 0;
          padding: 0 .5rem;
        }
      }

      .btn-events {
        border-color: $gray;
        color: #000;

        &:hover {
          background-color: #eee;
        }
      }
    }
  }
}

iframe.events-map {
  height: 350px;
}
</style>

<template>
  <div class="red-alert text-center">
    <header class="page-header" id="#top">
      <div class="container">
        <img class="logo" src="~/assets/images/warning.svg" alt="">
        <h1 class="upcase">Red Alert for Net Neutrality</h1>
        <p>The FCC voted to let ISPs ruin the Internet. But there’s an imminent vote in the US Senate to overrule them and restore net neutrality. Starting on May 9th until the day of the vote, put your website or social profile on RED ALERT to help sound the alarm and flood lawmakers with calls and emails. <b>Are you in?</b></p>
        <form @submit.prevent="submitForm()">
          <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
          <div class="row">
            <input v-model="name" placeholder="Name*" name="name" type="text" required autocomplete="name">
            <input v-model="email" placeholder="Email*" name="email" type="email" required autocomplete="email">
            <input v-model="zipCode" placeholder="ZIP*" name="zip_code" type="tel" required autocomplete="postal-code">
          </div>
          <button class="btn btn-block btn-large" :disabled="isSending">
            <span v-if="isSending">Saving...</span>
            <span v-else>Join the Protest</span>
          </button>
          <disclaimer></disclaimer>
        </form>
      </div>
    </header>

    <section>
      <div class="container">
        <h2>What's happening?</h2>
        <p>The US Senate is headed for a mid-May vote on a Congressional Review Act (CRA) resolution to block the FCC’s repeal of net neutrality. Starting on May 9th, and carrying through until the vote (likely about a week later), the Internet will “go red” to raise awareness and ensure that lawmakers hear from their constituents, who overwhelmingly support restoring open Internet protections. <a href="#social">Click to jump to instructions for how to join with your website or on social media.</a></p>
      </div>
    </section>

    <section>
      <div class="container">
        <h2>How to put your site on RED ALERT:</h2>
        <p>On May 9th, cover your homepage with an unavoidable message that informs visitors about the impending vote and invites them to take action. Then between May 9th and the vote, display a prominent alert on your homepage to continue driving calls and emails to lawmakers. See the examples below. Check back soon and we’ll provide some simple code that makes it easy to put any site on RED ALERT. You don’t have to use our code to participate, but you have to do something epic that gets your visitors attention drives calls and emails to Congress. This is the moment to fight!</p>
        <p><b>Starting at 12:01am on May 9th, the RED ALERT widget will display this:</b></p>
        <p><img src="~/assets/images/redalert/modal-preview.jpg" srcset="~/assets/images/redalert/modal-preview.jpg 1x, ~/assets/images/redalert/modal-preview@2x.jpg 2x" alt="A screenshot of our Red Alert modal" class="rounded"></p>
        <p><b>From 12:01am on May 10 until the midnight the night before the vote, the RED ALERT widget will look like this:</b></p>
        <p><img src="~/assets/images/redalert/modal-minimized-preview.jpg" srcset="~/assets/images/redalert/modal-minimized-preview.jpg 1x, ~/assets/images/redalert/modal-minimized-preview@2x.jpg 2x" alt="A screenshot of our Red Alert modal when minimized" class="rounded"></p>
        <p>Starting at midnight, the night before the vote, the widget will expand again.</p>
      </div>
    </section>

    <section id="social">
      <div class="container">
        <h2>Put your social media accounts on Red Alert</h2>
        <p>If you’re active on social media, have a video channel, or moderate an online forum, put your small piece of the Internet on RED ALERT by changing your profile and banner images, and scheduling frequent posts linking to <a href="https://www.battleforthenet.com">BattleForTheNet.com</a> where people can take action. Check back soon for a giant folder of content you can use.</p>
      </div>
    </section>

    <section id="events">
      <div class="container">
        <h2>Events</h2>
        <p>People and small businesses all over America are vigorously defending net neutrality by staging protests and organizing events at Congressional offices.  Check out the map below to view events in your area, or <a href="https://events.battleforthenet.com/">view our full events page here</a>.</p>
        <iframe class="events-map" src="https://events.battleforthenet.com/iframe"></iframe>
      </div>
    </section>

<!--     <section id="participants">
      <div class="container">
        <h2>Participants</h2>
        <p>Below is a list of notable websites, companies, and organizations who have confirmed their participation in the RED ALERT action. The list is broad, and represents a wide range of perspectives and online communities. The one thing all of them agree on: defending Title II net neutrality.</p>
        <ul class="logo-grid">
          <li><img src="/images/logos/demandprogress.png" alt="Demand Progress"></li>
          <li><img src="~/assets/images/fftf-light.svg" alt="Fight for the Future"></li>
          <li><img src="~/assets/images/free-press-logo.svg" alt="Free Press Action Fund"></li>
        </ul>
      </div>
    </section> -->

    <footer class="page-footer">
      <div class="container">
      <h4>Built by:</h4>
      <div class="logos">
        <a href="https://www.fightforthefuture.org"><img src="~/assets/images/fftf-light.svg" alt="Fight for the Future"></a>
        <a href="https://www.demandprogress.org"><img src="/images/logos/demandprogress.png" alt="Demand Progress"></a>
        <a href="https://www.freepress.net"><img src="~/assets/images/free-press-logo.svg" alt="Free Press Action Fund"></a>
      </div>
      <h4>For Press inquiries, please contact us at:</h4>
      <p><a href="tel://19788526457">978-852-6457</a> or <a href="tel://19788526457">978-852-6457</a> or <a href="mailto:press@fightforthefuture.org">press@fightforthefuture.org</a></p>
      <p><a href="tel://12015338838">201-533-8838</a> or <a href="mailto:tkarr@freepress.net">tkarr@freepress.net</a></p>
      <p><a href="tel://12026817582">202-681-7582</a> or <a href="mailto:press@demandprogress.org">press@demandprogress.org</a></p>
      <p>All other inquiries, contact <a href="mailto:team@fightforthefuture.org">team@fightforthefuture.org</a></p>
      </div>
    </footer>

    <persistent-button>
      <a class="flex-center" href="#top"><img src="~/assets/images/warning.svg" alt=""> <span>Join the Protest</span></a>
    </persistent-button>

    <social-sidebar :twitter-url="twitterShareURL" :facebook-url="facebookShareURL"></social-sidebar>

    <modal v-if="modalVisible">
      <header>
        <h2>Thanks!</h2>
      </header>
      <div class="modal-content">
        <experiment name="redalert-after-action">
          <variant slot="a">
            <p>We'll send you detailed instructions on how to participate in the Red Alert for net neutrality, so check your email shortly.  In the meantime, use the links below to share this campaign on social media, donate to the cause and find an event in your area.</p>
            <div class="flex-row">
              <facebook-button :url="facebookShareURL" @clicked="$trackEvent('facebook_button', 'click', 'redalert-after-action-a')"></facebook-button>
              <twitter-button :url="twitterShareURL" @clicked="$trackEvent('twitter_button', 'click', 'redalert-after-action-a')"></twitter-button>
              <a class="btn btn-donate" :href="donateLink" @click="$trackEvent('donate_button', 'click', 'redalert-after-action-a')">Donate</a>
            </div>
            <div class="or"><span>OR</span></div>
            <div class="flex-row">
              <a class="btn btn-events" href="https://events.battleforthenet.com/" target="_blank" @click="$trackEvent('events_button', 'click', 'redalert-after-action-a')">Find a protest near you</a>
            </div>
          </variant>
          <variant slot="b">
            <p>We'll send you detailed instructions on how to participate in the Red Alert for net neutrality, so check your email shortly. In the meantime, use the links below to share this campaign on social media.</p>
            <div class="flex-row">
              <facebook-button :url="facebookShareURL" @clicked="$trackEvent('facebook_button', 'click', 'redalert-after-action-b')"></facebook-button>
              <twitter-button :url="twitterShareURL" @clicked="$trackEvent('twitter_button', 'click', 'redalert-after-action-b')"></twitter-button>
            </div>
          </variant>
        </experiment>
      </div>
    </modal>
  </div>
</template>

<script>
import PersistentButton from '~/components/PersistentButton'
import SocialSidebar from '~/components/SocialSidebar'
import axios from 'axios'
import { createMetaTags, getDonateLink } from '~/assets/js/helpers'

const petitionId = 'e31d4d82-9fac-4cf0-882e-96bc565e1f25'
const shareURL = "https://www.battleforthenet.com/redalert/"

export default {
  layout: 'basic',

  head: {
    title: "Red Alert for Net Neutrality",

    link: [
      {
        rel: 'stylesheet',
        href: 'https://use.typekit.net/dkr1hdf.css'
      }
    ],

    meta: createMetaTags({
      title: "Congress will vote to save net neutrality",
      description: "In mid-May, the U.S. Senate will vote on whether or not to save net neutrality. Join millions of other every day Americans demanding freedom on the Internet.",
      image: "https://www.battleforthenet.com/images/share_images/redalert.png",
      url: shareURL
    })
  },

  components: {
    PersistentButton,
    SocialSidebar
  },

  data() {
    return {
      name: null,
      email: null,
      zipCode: null,
      phone: null,
      isSending: false,
      errorMessage: null,
      modalVisible: false
    }
  },

  computed: {
    donateLink() {
      return getDonateLink(this.$store.state.org)
    },

    facebookShareURL() {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`
    },

    twitterShareURL: function() {
      const tweetText = "In mid-May, the U.S. Senate will vote on whether or not to save net neutrality. Join millions of other every day Americans demanding freedom on the Internet."
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareURL)}`
    },
  },

  methods: {
    async submitForm() {
      this.isSending = true
      this.$trackEvent('redalert_form', 'submit')

      try {
        const { data } = await axios.post(
          `https://fv8xpw9hri.execute-api.us-east-1.amazonaws.com/v1/petitions/${petitionId}/signatures`,
          {
            name: this.name,
            email: this.email,
            phone: this.phone,
            zip_code: this.zipCode,
            comments: this.comments,
            tags: 'net-neutrality'
          }
        )

        this.resetForm()
        this.modalVisible = true
      }
      catch (error) {
        console.error(error)
        this.isSending = false
        this.errorMessage = "That didn't work for some reason 😞"
      }
    },

    resetForm() {
      this.isSending = false
      this.name = null
      this.email = null
      this.phone = null
      this.zipCode = null
    }
  }
}
</script>
