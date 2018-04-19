<style lang="scss" scoped>
section {
  text-align: center;
}

h1 {
  text-transform: uppercase;
}

h2 {
  color: #fff;

  strong {
    color: $header-color;
  }
}

.businesses:after {
  content:"";
  display:block;
  clear:both;
}

.businesses strong {
  color: #fff;
}

@media screen and (max-width: 700px) {
  h1 {
    font-size: 32px;
  }

  .business-card {
    width: 33%;
    padding: 6px;
  }
}

@media screen and (max-width: 450px) {
  section:first-child {
    margin-top: 0;
  }

  h1 {
    font-size: 22px;
  }

  h2 {
    font-size: 20px;
  }

  .business-card {
    width: 50%;
    padding: 6px;
  }
}
</style>

<template>
  <div class="container">
    <section>
      <h1>Small businesses can<br> save net neutrality</h1>
      <p>Small businesses are the backbone of our nation’s economy, employing over 120 million Americans and contributing 2/3 of all new jobs created each year. So when small businesses talk, Congress listens.
      </p>
      <p>We believe that net neutrality is integral for helping small businesses find new customers and compete with large corporations. We want to rally small businesses to support net neutrality by signing our letter to Congress and meet with their Congressional representatives. Will you reach out to small businesses in your community and ask them to join the cause?
      </p>
      <p>Small business owners can <a href="https://businessesfornetneutrality.com">sign our letter here</a>.
      </p>
    </section>

    <section id="step1">
      <h2><strong>Step 1:</strong> Reach out to small businesses in your state</h2>
      <p>Below is a list of some small businesses in your state.  Reach out to them and ask them to support net neutrality.  You can tweet at them, call them or even go visit them in person if they're close by.  Be polite.  Be respectful.  And let them know that net neutrality helps their business.
      </p>
      <p class="state-selector">
        <select v-model="selectedState">
          <option :value="null">Select state</option>
          <option v-for="(name, code) in states" :key="code" :value="code">{{ isLoading && code == selectedState ? 'Loading data...' : name }}</option>
        </select>
      </p>
      <no-ssr>
        <div class="businesses">
          <business-card v-for="business in localBusinesses" :business="business" :key="business.twitter"></business-card>
          <p v-if="localBusinesses.length < 1 && selectedState">We don't have any businesses on file for your state yet. <br><strong>Can you help us out by <a href="https://docs.google.com/spreadsheets/d/12MkAWz8VGyIIiCgVdGXWfLKROBegZNew8-xKyPVv6vU/edit#gid=0">adding some to our spreadsheet</a>?</strong></p>
        </div>
      </no-ssr>
      <p>(If your business is on this list, you can contact us at <a href="mailto:team@fightforthefuture.org">team@fightforthefuture.org</a>)</p>
    </section>

    <section id="step2">
      <h2><strong>Step 2:</strong> Retweet the people who've already tweeted</h2>
      <p>            
        <a class="twitter-timeline" href="https://twitter.com/search?q=businessesfornetneutrality.com" data-widget-id="958830309532946437">Tweets about businessesfornetneutrality.com</a>
        <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
      </p>
    </section>

    <section id="step3">
      <h2><strong>Step 3:</strong> Tweet these out-of-state businesses</h2>
      <p>These businesses are located in states where Congress is on the fence about supporting net neutrality.  Let them know how important this issue is!
      </p>
      <div class="businesses" v-if="priorityBusinesses.length > 0" v-cloak>
        <business-card v-for="business in priorityBusinesses" :business="business" :national="true" :key="business.twitter"></business-card>
      </div>
    </section>

    <section id="step4">
      <h2><strong>Step 4:</strong> Come back tomorrow!</h2>
      <p>Enter your information to sign up for updates with new targets to persuade!
      </p>
      <mothership-form an-tags="net-neutrality" an-petition-id="11f84b38-e65b-4259-b0ae-e879a4044ca9"></mothership-form>
    </section>
    
    <section id="step5">
      <h2><strong>Step 5:</strong> Reach out to your favorite local businesses</h2>
      <p>We created a list of businesses we thought might be open to supporting net neutrality. But you may know businesses in your area who weren't on our list. Please let them know how important net neutrality is to their customers.  We'd love to have them sign our petition!        
      </p>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import BusinessCard from '~/components/BusinessCard'
import MothershipForm from '~/components/MothershipForm'
import US_STATES from '~/assets/data/states.json'
import shuffle from 'lodash/shuffle'
import { createMetaTags, geocodeSelectedState } from '~/assets/js/helpers'

export default {
  head: {
    title: "Join the Battle for Net Neutrality",
    meta: createMetaTags({
      title: "Small businesses can save net neutrality",
      description: "The FCC is trying to kill the Internet again. This time, it’s even worse. Here’s how to stop them...",
      image: "https://www.battleforthenet.com/images/share_images/urgent.png",
      url: "https://www.battleforthenet.com/business/"
    })
  },

  components: {
    BusinessCard,
    MothershipForm
  },

  data() {
    return {
      isLoading: false,
      selectedState: null,
      localBusinesses: [],
      priorityBusinesses: [],
      tweetCount: 0
    }
  },

  computed: {
    states: () => US_STATES,
  },

  watch: {
    selectedState(newValue) {
      if (newValue) {
        this.fetchLocalBusinesses()
      }
      else {
        this.localBusinesses = []
      }

      if (process.browser) {
        localStorage.selectedState = newValue
      }
    }
  },

  async created() {
    this.fetchPriorityBusinesses()

    if (process.browser) {
      if (localStorage.selectedState) {
        this.selectedState = localStorage.selectedState
      }
      else {
        const { code } = await geocodeState()
        this.selectedState = code
      }
    }
  },

  methods: {
    uniqueifyBusinesses(businesses) {
      var uids = [];
      var uniqueishBusinesses = [];
      
      for (var i = 0; i < businesses.length; i++) {
        var biz = businesses[i];
        var uid = biz.twitter + biz.state;

        if (uids.indexOf(uid) === -1) {
          uids.push(uid);
          uniqueishBusinesses.push(biz);
        }
      }

      return uniqueishBusinesses;
    },

    async fetchLocalBusinesses() {
      this.isLoading = true

      try {
        const { data } = await axios.get(`https://data.battleforthenet.com/businesses/${this.selectedState.toLowerCase()}.json`)
        const businesses = this.uniqueifyBusinesses(data)
        this.localBusinesses = shuffle(businesses).slice(0, 20)
      }
      catch (err) {
        console.error(err)
      }

      this.isLoading = false
    },

    async fetchPriorityBusinesses() {
      try {
        const { data } = await axios.get('https://data.battleforthenet.com/businesses/priority.json')
        this.priorityBusinesses = shuffle(data).slice(0, 12)
      }
      catch (err) {
        console.error(err)
      }
    },
  }
}
</script>