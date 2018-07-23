<style lang="scss">
.rep-interstitial .scorecard {
  margin-bottom: 2rem;

  h3 {
    font-size: 3rem;
    margin: 0 0 2rem;

    > p {
      font-size: inherit;
      font-weight: inherit;
      margin: 0;
    }
  }

  .against h3 strong {
    color: #ff2525;
  }

  .supports h3 strong {
    color: #2fffa0;
  }

  .scoreboard-photo {
    width: 15.3rem;
    height: 18.6rem;
    margin-right: 1rem;
  }

  .btn {
    text-align: center;
    margin: 0.5rem 0;
    display: block;
  }

  .btn:not(.btn-cta) {
    color: #111;
    background-color: #fff;
    border: .2rem solid #111;

    &:before {
      content: none;
    }

    &:hover {
      background-color: darken(#fff, 10%);
    }
  }
}
</style>

<template>
  <div class="rep-interstitial">
    <CallForm v-if="callFormIsVisible" :in-modal="true" :title="$lt('call_form_title')" />
    <div v-else class="scorecard">
      <div class="supports" v-if="rep.supports_cra">
        <h3 v-html="$lt('supports_headline_html')"></h3>
        <div class="flex-center">
          <ScoreboardPhoto :rep="rep" />
          <div class="buttons">
            <a class="btn btn-large btn-cta" href="https://act.demandprogress.org/sign/sign-up-text-team-internet/" @click="$trackClick('rep_interstitial_volunteer_button', 'supports')">{{ $lt('volunteer_button') }}</a>
            <a class="btn btn-large" href="https://actionnetwork.org/forms/sign-up-to-attend-an-event-during-august-recess-to-help-save-net-neutrality/" @click="$trackClick('rep_interstitial_events_button', 'supports')">{{ $lt('events_button') }}</a>
            <DonateButton class="btn btn-large" @clicked="$trackClick('rep_interstitial_donate_button', 'supports')">{{ $lt('donate_button')}}</DonateButton>
          </div>
        </div>
      </div>
      <div class="against" v-else>
        <h3 v-html="$lt('against_headline_html')"></h3>
        <div class="flex-center">
          <ScoreboardPhoto :rep="rep" />
          <div class="buttons">
            <a class="btn btn-large btn-cta" href="#" @click.prevent="$trackClick('rep_interstitial_call_button'); callFormIsVisible = true">{{ $lt('call_button') }}</a>
            <a class="btn btn-large" href="https://actionnetwork.org/forms/sign-up-to-attend-an-event-during-august-recess-to-help-save-net-neutrality/" @click="$trackClick('rep_interstitial_events_button', 'supports')">{{ $lt('events_button') }}</a>
            <DonateButton class="btn btn-large" @clicked="$trackClick('rep_interstitial_donate_button', 'against')">{{ $lt('donate_button')}}</DonateButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScoreboardPhoto from '~/components/ScoreboardPhoto'
import CallForm from '~/components/CallForm'

export default {
  components: {
    CallForm,
    ScoreboardPhoto
  },

  props: [ 'rep' ],

  data() {
    return {
      callFormIsVisible: false
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`components.RepInterstitial.${key}`, vars)
    }
  }
}
</script>
