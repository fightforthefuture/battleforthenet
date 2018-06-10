<style lang="scss" scoped>
.form {
  width: 80%;
  max-width: 350px;
  margin: 1rem auto;
}

input, textarea {
  font-family: $body-font;
  font-weight: 300;
  padding: 1rem 1.5rem;
  text-align: center;

  &::placeholder {
    // color: #201b2c;
    font-weight: 300;
  }
}

.reps {
  display: flex;
  justify-content: center;
  flex-flow: row wrap;

  .rep {
    width: 50%;
    padding: 1rem;

    @include mobile {
      width: 100%;
    }
  }

  .buttons {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    flex-flow: row wrap;

    li {
      width: 50%;
      padding: 0.2rem;

      // &:last-child {
      //   width: 100%;
      // }
    }

    .btn {
      padding: .7rem .5rem;
      border-radius: 0.6rem;
      display: block;

      &:before {
        content: none;
      }
    }

    .btn-facebook {
      // border: 1px solid $facebook-blue;
      // color: $facebook-blue;
      // background: transparent;
    }

    .btn-twitter {
      // border: 1px solid $twitter-blue;
      // color: $twitter-blue;
      // background: transparent;
    }
  }
}
</style>

<template>
  <no-ssr>
    <div class="wanted-poster">
      <div class="form">
        <input type="tel" v-model="zipCode" :placeholder="$lt('zip_placeholder')" class="zip">
      </div>
      <div class="reps" v-if="badReps.length > 0">
        <div class="rep" v-for="rep in badReps" :key="rep.biocode">
          <a :href="postImageSrc(rep)" target="_blank" @click="$trackEvent('wanted_poster_main_image', 'click', rep.name)"><img :src="postImageSrc(rep)" alt="" @load="setHash()"></a>
          <ul class="buttons">
            <li><a class="btn" :href="profileImageSrc(rep)" target="_blank" @click="$trackEvent('wanted_poster_profile_image_button', 'click', rep.name)">{{ $lt('profile_image_button') }}</a></li>
            <li><a class="btn" :href="postImageSrc(rep)" target="_blank" @click="$trackEvent('wanted_poster_post_image_button', 'click', rep.name)">{{ $lt('post_image_button') }}</a></li>
            <li><facebook-button :url="facebookURL(rep)" @clicked="$trackEvent('wanted_poster_share_button', 'click', rep.name)">{{ $lt('facebook_button') }}</facebook-button></li>
            <li><twitter-button :url="twitterURL(rep)" @clicked="$trackEvent('wanted_poster_tweet_button', 'click', rep.twitter)">{{ $lt('twitter_button') }}</twitter-button></li>
          </ul>
        </div>
      </div>
      <div v-else-if="reps.length > 0" v-html="$lt('no_bad_reps_html')"></div>
      <div v-else-if="zipCode && zipCode.length > 4" v-html="$lt('no_reps_html')"></div>
    </div>
  </no-ssr>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      zipCode: null,
      reps: []
    }
  },

  computed: {
    badReps() {
      return this.reps.filter(r => !r.cra)
    }
  },

  watch: {
    async zipCode() {
      if (!this.zipCode) {
        this.reps = []
      }
      else if (this.zipCode.length >= 5) {
        try {
          const { data } = await axios.get(`https://data.battleforthenet.com/wanted/${this.zipCode.substr(0, 5)}.json`)
          this.reps = data
        }
        catch (error) {
          this.reps = []
        }
      }

      if (process.browser) {
        if (this.zipCode) {
          localStorage.zipCode = this.zipCode
        }
        else {
          localStorage.removeItem('zipCode')
        }
      }
    }
  },

  created() {
    if (this.$route.query.wanted && this.$route.query.wanted !== '00000') {
      this.zipCode = this.$route.query.wanted
    }
    else if (process.browser && localStorage.zipCode) {
      this.zipCode = localStorage.zipCode
    }
  },

  mounted() {
    setTimeout(this.setHash, 1000)
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`components.WantedPoster.${key}`, vars)
    },

    setHash() {
      if (process.browser && this.$route.query.wanted !== undefined) {
        location.hash = 'wanted'
      }
    },

    postImageSrc({ biocode }) {
      return `https://data.battleforthenet.com/wanted-posters/post/${biocode}.jpg`
    },

    profileImageSrc({ biocode }) {
      return `https://data.battleforthenet.com/wanted-posters/profile/${biocode}.jpg`
    },

    tweetText({ twitter }) {
      return this.$lt('tweet_text', { twitter: twitter })
    },

    facebookURL({ state, district }) {
      const url = `https://wanted.battleforthenet.com/${state}-${district}.html`
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },

    twitterURL(rep) {
      const tweetText = this.tweetText(rep)
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    }
  }
}
</script>
