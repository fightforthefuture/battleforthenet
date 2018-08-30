<style lang="scss" scoped>
.btn {
  letter-spacing: 0.2rem;
}

.btn-events {
  color: #111;
  background-color: #fff;
  border: .2rem solid #9a9a9a;
  font-size: 1.7rem;
  display: block;
  margin-bottom: 1rem;
  padding: 1.7rem 0;
  text-align: center;

  &:hover {
    background-color: darken(#fff, 10%);
  }

  img {
    width: 15px;
    height: 21px;
    margin: 0 1rem -0.45rem 0;
  }
}

.btn-donate {
  background-color: #ffeb65;
  color: #000;

  &:hover {
    background-color: darken(#ffeb65, 10%);
  }
}

.flex-row .btn {
  font-size: 1.2rem;
  padding: 1.5rem 0;

  &:before {
    content: none;
  }
}

b {
  font-weight: 700;
}

h2 img {
  width: 32px;
  height: 32px;
  margin: 0 0 -0.25rem 0;
}

h3 {
  font-size: 2.8rem;
  line-height: 1;
  margin: 1rem 0;
}

hr {
  border: 0;
  height: 1px;
  background-color: #ccc;
  margin: 3.5rem 0;
}

.warning {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1.5rem;

  img {
    width: 18px;
    height: 18px;
    margin: 0 .25rem -.35rem 0;
  }
}
</style>

<template>
  <div>
    <h2>
      <img src="~/assets/images/call-icon.svg" alt="">
      Calling you now...
    </h2>
    <p><b>Introduce yourself, be polite, and say:</b></p>
    <p>{{ callScript }}</p>
    <div class="warning">
      <img src="~/assets/images/warning-circle.svg" alt="">
      If lines are busy, we may call you in a few minutes.
    </div>
    <hr>
    <h3>Done calling? Do these things, too!</h3>
    <div class="buttons">
      <a v-if="page != 'california'" class="btn btn-events" href="https://events.battleforthenet.com/" target="_blank" @click="$trackEvent('call_script_events_button', 'click')">
        <img src="~/assets/images/map-marker.svg" alt="">
        Join an event near you
      </a>
      <div class="flex-row">
        <facebook-button @clicked="$trackEvent('call_script_facebook_button', 'click')">Share on Facebook</facebook-button>
        <twitter-button @clicked="$trackEvent('call_script_twitter_button', 'click')">Share on Twitter</twitter-button>
        <donate-button @clicked="$trackEvent('call_script_donate_button', 'click')">Donate</donate-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: [ 'page' ],

  computed: {
    ...mapState(['org']),

    callScript() {
      if (this.page === 'california') {
        return "I'm calling to ask my Senator to support SB 822 which restores net neutrality protections to California. We need these protections to ensure an open internet for all Californians, including small business owners, activists and entrepreneurs."
      }
      else {
        return "I'm calling to ask my lawmakers to support the Congressional Review Act resolution to block the FCC's repeal of net neutrality and restore the open Internet. Thank you."
      }
    }
  }
}
</script>
