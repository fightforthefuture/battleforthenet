<style lang="scss">
@mixin scoreboard-card-btn($value-bg-color, $label-bg-color, $img-height) {
  background-color: $label-bg-color;

  .value-bg {
    background-color: $value-bg-color;

    &:after {
      border-left-color: $value-bg-color;
    }
  }

  img {
    height: $img-height;
  }

  &:hover {
    $percentage: 5%;
    background-color: darken($label-bg-color, $percentage);
    cursor: pointer;
    transition: background-color .2s;

    .value-bg {
      background-color: darken($value-bg-color, $percentage);
      transition: background-color .2s;

      &:after {
        transition: border-left-color .2s;
        border-left-color: darken($value-bg-color, $percentage);
      }
    }
  }
}

.scoreboard-id {
  .page-header {
    background-color: #14111b;

    h1 {
      font-size: 4rem;

      strong {
        font-weight: bold;
      }
    }

    .description {
      margin: 2rem 0 0;

      p {
        font-size: 1.8rem;
      }
    }

    .scoreboard-action-box {
      $color: #8c30ff;
      margin: 1rem auto -1rem;

      .btn {
        background-color: $color;

        &:hover {
          background-color: darken($color, 5%);
        }
      }

      .stats {
        color: $color;
      }
    }
  }

  &.against h1 strong {
    color: #ff4a4a;
  }

  &.supports h1 strong {
    color: #39c0a7;
  }

  section.boxes {
    position: relative;
    padding-top: 2rem;

    &:after {
      bottom: 100%;
      left: 50%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: rgba(136, 183, 213, 0);
      border-bottom-color: $alt-bg-color;
      border-width: 3rem;
      margin-left: -3rem;
    }

    .container {
      width: 45rem;
    }
  }

  .modal {
    h2 {
      font-size: 3.7rem;
    }
  }

  .petition-form {
    border: 0;
    padding: 0;

    .disclaimer {
      width: 96%;
      text-align: center;
    }
  }
}

.scoreboard-card {
  background-color: #322b45;
  border-radius: $border-radius;
  padding: 1.2rem;
  max-width: 45rem;
  margin: auto;
  display: flex;

  .scoreboard-photo {
    width: 17rem;
    height: auto;

    @include mobile {
      width: 15rem;
    }

    h5 {
      font-size: 1.8rem;
    }

    &.long-name h5 {
      font-size: 1.3rem;
    }
  }

  .buttons {
    width: 29rem;
    padding-left: 1rem;
    display: flex;
    flex-direction: column;

    button, .btn {
      flex: 1;
      border-radius: $border-radius;
      font-size: 2.2rem;
      font-weight: 700;
      font-family: $body-font;
      text-transform: uppercase;
      border: none;
      background: transparent;
      margin-bottom: 0.6rem;
      padding: 0;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        cursor: pointer;
      }

      .value-bg {
        border-radius: $border-radius 0 0 $border-radius;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 36%;

        &:after {
          left: 100%;
          top: 50%;
          border: solid transparent;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
          border-color: rgba(136, 183, 213, 0);
          border-left-color: #88b7d5;
          border-width: 10px;
          margin-top: -10px;
        }
      }

      .value {
        width: 36%;
        position: relative;
      }

      .label {
        flex: 2;
        border-radius: 0 $border-radius $border-radius 0;
        position: relative;
        letter-spacing: 0.1rem;
        text-align: center;

        img {
          width: auto;
          margin-right: 0.5rem;
        }
      }

      &.call {
        @include scoreboard-card-btn(#188d49, #27d26f, 1.9rem);
      }

      &.write {
        @include scoreboard-card-btn(#6324b3, #8c30ff, 1.4rem);
      }

      &.tweet {
        @include scoreboard-card-btn(#1296b7, #1cc2ec, 1.6rem);
      }

      &.btn-facebook, &.btn-twitter, &.btn-volunteer {
        font-size: 1.8rem;

        &:before {
          content: none;
        }
      }

      &.btn-facebook {
        background-color: $facebook-blue;

        &:hover {
          background-color: darken($facebook-blue, 10%);
        }
      }

      &.btn-twitter {
        background-color: $twitter-blue;

        &:hover {
          background-color: darken($twitter-blue, 10%);
        }
      }

      &.btn-volunteer {
        background-color: #635686;

        &:hover {
          background-color: darken(#635686, 5%);
        }
      }
    }
  }
}

.scoreboard-action-box .share-buttons {
  .btn {
    font-size: 1.5rem;
    padding: 1.3rem;

    &:before {
      content: none;
    }

    &.btn-facebook {
      background-color: $facebook-blue;

      &:hover {
        background-color: darken($facebook-blue, 10%);
      }
    }

    &.btn-twitter {
      background-color: $twitter-blue;

      &:hover {
        background-color: darken($twitter-blue, 10%);
      }
    }
  }
}
</style>

<template>
  <div class="scoreboard-id" :class="status">
    <section class="page-header">
      <div class="container">
        <h1 v-html="titleHTML"></h1>

        <div class="scoreboard-card">
          <scoreboard-photo :rep="rep"></scoreboard-photo>
          <div class="buttons" v-if="rep.supports_cra">
            <facebook-button :url="shareURL">{{ $lt('supports.facebook_button') }}</facebook-button>
            <twitter-button :url="twitterURL">{{ $lt('supports.twitter_button') }}</twitter-button>
            <a class="btn btn-volunteer" :href="volunteerURL">{{ $lt('supports.volunteer_button') }}</a>
          </div>
          <div class="buttons" v-else>
            <button class="call" @click="call()">
              <span class="value-bg" v-if="rep.call_count"></span>
              <span class="value" v-if="rep.call_count">{{ rep.call_count | formatNumber }}</span>
              <span class="label">
                <img src="~/assets/images/scoreboard-call-icon.svg" alt="">
                {{ $lt('against.call_button') }}
              </span>
            </button>
            <button class="write" @click="write()">
              <span class="value-bg" v-if="rep.letter_count"></span>
              <span class="value" v-if="rep.letter_count">{{ rep.letter_count | formatNumber }}</span>
              <span class="label">
                <img src="~/assets/images/scoreboard-write-icon.svg" alt="">
                {{ $lt('against.write_button') }}
              </span>
            </button>
            <button class="tweet" @click="tweet()">
              <span class="value-bg" v-if="rep.tweet_count"></span>
              <span class="value" v-if="rep.tweet_count">{{ rep.tweet_count | formatNumber }}</span>
              <span class="label">
                <img src="~/assets/images/scoreboard-tweet-icon.svg" alt="">
                {{ $lt('against.tweet_button') }}
              </span>
            </button>
          </div>
        </div>

        <div class="description" v-html="descriptionHTML"></div>

        <!-- <scoreboard-action-box v-if="actionTeamURL"
          :title="$lt('action_team.title') "
          :description="$lt('action_team.description')"
          :cta_button="$lt('action_team.cta_button')"
          :cta_url="actionTeamURL"
        /> -->
      </div>
    </section>

    <section class="boxes">
      <div class="container">
        <scoreboard-action-box
          :title="$lt('boxes.events.title') "
          :description="$lt('boxes.events.description')"
          :cta_button="$lt('boxes.events.cta_button')"
          :cta_url="mapURL"
        />

        <scoreboard-action-box
          :title="$lt('boxes.business.title') "
          :description="businessBoxDescription"
          :cta_button="$lt('boxes.business.cta_button')"
          cta_url="https://www.businessesfornetneutrality.com"
         />

        <scoreboard-action-box
          :title="$lt('boxes.donate.title') "
          :description="$lt('boxes.donate.description')"
          :cta_button="$lt('boxes.donate.cta_button')"
          :cta_url="donateURL"
        />

        <scoreboard-action-box
          :title="$lt('boxes.scoreboard.title')"
          :description="$lt('boxes.scoreboard.description')"
          :cta_button="$lt('boxes.scoreboard.cta_button')"
          cta_url="/scoreboard/all"
        />

        <scoreboard-action-box v-if="!rep.supports_cra"
          :title="$lt('boxes.share.title') "
          :description="$lt('boxes.share.description')"
          class="share-box"
        >
          <div class="share-buttons flex-row">
            <facebook-button :url="shareURL" @clicked="$trackEvent('scoreboard_rep_facebook_share_button', 'click')">{{ $lt('boxes.share.facebook_button') }}</facebook-button>
            <twitter-button :url="twitterURL" @clicked="$trackEvent('scoreboard_rep_twitter_share_button', 'click')">{{ $lt('boxes.share.twitter_button') }}</twitter-button>
          </div>
        </scoreboard-action-box>
      </div>
    </section>

    <modal v-if="modalVisible">
      <call-form v-if="modal == 'call'" :in-modal="true" page="scoreboard" :title="$lt('call_form_title')"></call-form>
      <petition-form v-else :in-modal="true" :title="$lt('petition_form_title')"></petition-form>
    </modal>
  </div>
</template>

<script>
import axios from 'axios'
import { createMetaTags, formatNumber, getDonateLink, openPopup } from '~/assets/js/helpers'
import ScoreboardPhoto from '~/components/ScoreboardPhoto'
import ScoreboardActionBox from '~/components/ScoreboardActionBox'
import ScoreboardForm from '~/components/ScoreboardForm'
import CallForm from '~/components/CallForm'
import PetitionForm from '~/components/PetitionForm'

async function fetchRep(bioguideId) {
  try {
    const { data } = await axios.get(`https://data.battleforthenet.com/scoreboard/${bioguideId}.json`)
    return data
  }
  catch (error) {
    return {}
  }
}

async function fetchBusinessCount(state) {
  try {
    const { data } = await axios.get(`https://data.battleforthenet.com/businesses/${state.toLowerCase()}.json`)
    return data.length
  }
  catch (error) {
    return null
  }
}

export default {
  components: {
    ScoreboardPhoto,
    ScoreboardActionBox,
    ScoreboardForm,
    CallForm,
    PetitionForm
  },

  head() {
    const vars = {
      name: this.repTitleAndName,
      amount: this.formattedContributions
    }

    return {
      title: this.$lt(`${this.status}.document_title`, vars),
      meta: createMetaTags({
        title: this.$t('pages.scoreboard.social.title'),
        description: this.$t('pages.scoreboard.social.description'),
        image: this.$t('pages.scoreboard.social.image'),
        url: this.$t('pages.scoreboard.social.url')
      })
    }
  },

  data() {
    return {
      modalVisible: false,
      modal: null
    }
  },

  async asyncData(context) {
    const rep = await fetchRep(context.route.params.id)
    const bizCount = await fetchBusinessCount(rep.state)

    return {
      rep: rep,
      businessCount: bizCount
    }
  },

  computed: {
    status() {
      return this.rep.supports_cra ? 'supports' : 'against'
    },

    repTitle() {
      if (this.rep.organization === 'Senate') {
        return 'senator'
      }
      else {
        return 'representative'
      }
    },

    repTitleAndName() {
      const title = this.rep.organization === 'Senate' ? 'Senator' : 'Rep.'
      return `${title} ${this.rep.first_name} ${this.rep.last_name}`
    },

    titleHTML() {
      return this.$lt(`${this.status}.title_html`, {
        title: this.repTitle
      })
    },

    descriptionHTML() {
      if (!this.rep.supports_cra && !this.rep.cable_contributions) {
        return this.$lt('against.no_amount_description_html', {
          name: this.repTitleAndName
        })
      }
      else {
        return this.$lt(`${this.status}.description_html`, {
          name: this.repTitleAndName,
          amount: this.formattedContributions
        })
      }
    },

    formattedContributions() {
      if (this.rep.cable_contributions) {
        return '$' + formatNumber(this.rep.cable_contributions)
      }
      return null
    },

    shareURL() {
      return `https://www.battleforthenet.com/scoreboard/${this.rep.bioguide_id}/`
    },

    tweetText() {
      return this.$lt(`${this.status}.tweet_text`, { twitter: this.rep.twitter, url: this.shareURL})
    },

    twitterURL() {
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.tweetText)}`
    },

    // TODO: fill this in
    actionTeamURL() {
      return ''
    },

    volunteerURL() {
      return 'https://act.demandprogress.org/sign/sign-up-text-team-internet/'
    },

    businessBoxDescription() {
      const bizCount = this.businessCount ? formatNumber(this.businessCount) : 'Many'
      return this.$lt('boxes.business.description', {
        count: bizCount
      })
    },

    donateURL() {
      return getDonateLink(this.$store.state.org)
    },

    mapURL() {
      let url = 'https://www.battleforthenet.com/map/'

      if (this.$store.state.zipCode) {
        url += `?zip=${this.$store.state.zipCode}`
      }

      return url
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.scoreboard.id.${key}`, vars)
    },

    call() {
      this.$trackEvent('scoreboard_rep_call_button', 'click')
      this.modal = 'call'
      this.modalVisible = true
    },

    write() {
      this.$trackEvent('scoreboard_rep_write_button', 'click')
      this.modal = 'write'
      this.modalVisible = true
    },

    tweet() {
      this.$trackEvent('scoreboard_rep_tweet_button', 'click')
      openPopup(this.twitterURL, 'share')
    }
  }
}
</script>
