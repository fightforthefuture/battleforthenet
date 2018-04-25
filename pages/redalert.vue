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
        <h1 class="upcase">{{ $t('redalert.title') }}</h1>
        <p v-html="$t('redalert.intro_html')"></p>
        <form @submit.prevent="submitForm()">
          <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
          <div class="row">
            <input v-model="name" :placeholder="$t('redalert.form.name_placeholder')" name="name" type="text" required autocomplete="name">
            <input v-model="email" :placeholder="$t('redalert.form.email_placeholder')" name="email" type="email" required autocomplete="email">
            <input v-model="zipCode" :placeholder="$t('redalert.form.zip_placeholder')" name="zip_code" type="tel" required autocomplete="postal-code">
          </div>
          <button class="btn btn-block btn-large" :disabled="isSending">
            <span v-if="isSending">{{ $t('redalert.form.button_loading') }}</span>
            <span v-else>{{ $t('redalert.form.button_cta') }}</span>
          </button>
          <disclaimer></disclaimer>
        </form>
      </div>
    </header>

    <section v-for="(section, id) in sections" :id="id" :key="id">
      <div class="container">
        <h2>{{ section.title }}</h2>
        <div v-html="section.body_html"></div>
      </div>
    </section>

    <persistent-button>
      <a class="flex-center" href="#top"><img src="~/assets/images/warning.svg" alt=""> <span>{{ $t('redalert.persistent_button') }}</span></a>
    </persistent-button>

    <social-sidebar :twitter-url="twitterShareURL" :facebook-url="facebookShareURL"></social-sidebar>

    <modal v-if="modalVisible">
      <header>
        <h2>Thanks!</h2>
      </header>
      <div class="modal-content">
        <experiment name="redalert-after-action">
          <variant slot="a">
            <div v-html="$t('redalert.after_action.a.body_html')"></div>
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
            <div v-html="$t('redalert.after_action.b.body_html')"></div>
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
    sections() {
      return this.$t('redalert.sections')
    },

    donateLink() {
      return getDonateLink(this.$store.state.org)
    },

    facebookShareURL() {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`
    },

    twitterShareURL: function() {
      const tweetText = this.$t('redalert.tweet_text')
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
        this.errorMessage = this.$t('redalert.form.generic_error')
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
