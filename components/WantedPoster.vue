<style lang="scss">
.reps {
  display: flex;
  justify-content: center;
  flex-flow: row wrap;

  .rep {
    width: 50%;
    padding: 1rem;
  }
}
</style>

<template>
  <div>
    <p>
      <input type="tel" v-model="zipCode" placeholder="Enter your Zip Code to find your Rep">
    </p>
    <div class="reps">
      <div class="rep" v-for="rep in reps" :key="rep.biocode">
        <a :href="postImageSrc(rep)" target="_blank"><img :src="postImageSrc(rep)" alt=""></a>
        <p>
          <a class="btn" :href="profileImageSrc(rep)" target="_blank">Get Profile image</a>
          <!-- <a class="btn">Share</a> -->
          <br>
          <facebook-button :url="facebookURL(rep)">Share</facebook-button>
          <twitter-button :url="twitterURL(rep)">Tweet</twitter-button>
        </p>
      </div>
    </div>
  </div>
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

  watch: {
    async zipCode() {
      if (this.zipCode.length >= 5) {
        const { data } = await axios.get(`https://data.battleforthenet.com/wanted/${this.zipCode.substr(0, 5)}.json`)
        this.reps = data
      }
      console.log(this.zipCode)
    }
  },

  created() {
    this.zipCode = this.$route.params.wanted
  },

  mounted() {
    if (process.browser && this.$route.params.wanted) {
      location.hash = 'wanted'
    }
  },

  methods: {
    postImageSrc({ biocode }) {
      return `https://data.battleforthenet.com/wanted-posters/post/${biocode}.jpg`
    },

    profileImageSrc({ biocode }) {
      return `https://data.battleforthenet.com/wanted-posters/profile/${biocode}.jpg`
    },

    shareURL({ state, district }) {
      return `https://www.battleforthenet.com/wanted/${state}-${district}`
    },

    tweetText({ twitter }) {
      return `.@${twitter} is currently allowing internet companies to censor and manipulate us. We can stop them: battleforthenet.com #battleforthenet #netneutrality #savethenet`
    },

    facebookURL(rep) {
      const url = this.shareURL(rep)
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },

    twitterURL(rep) {
      const tweetText = this.tweetText(rep)
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    }
  }
}
</script>
