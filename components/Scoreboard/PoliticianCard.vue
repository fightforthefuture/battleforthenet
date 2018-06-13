<style lang="scss" scoped>
$tweet-btn-color: #2a94c8;
$call-btn-color: #ff2a2a;

.politician {
  display: inline-block;
  margin: 1rem;
  position: relative;

  @include mobile {
    margin: 0.75rem;
  }

  img, .cover, .yes-bg {
    width: 10rem;
    height: 12.2rem;
    border-radius: $border-radius;
  }

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255,26,9,0.5);

    &:hover {
      cursor: pointer;
    }
  }

  h5 {
    position: absolute;
    bottom: .6rem;
    left: 0px;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.3rem;
    text-shadow: 0 0 5px rgba(0, 0, 0, 1.0);
    margin: 0;
    padding: 0;
    color: #fff;

    small {
      display: block;
      font-size: 1rem;
    }
  }

  &.long-name h5 {
    font-size: 0.95rem;
    bottom: .9rem;
  }

  .btn {
    padding: .7rem .5rem;
    margin-bottom: 0.5rem;
    display: block;
    background-color: transparent;
    border-radius: $border-radius * 1.2;
  }

  .btn-twitter {
    border: 1px solid $tweet-btn-color;
    color: $tweet-btn-color;

    &:hover {
      color: darken($tweet-btn-color, 15%);
      border-color: darken($tweet-btn-color, 15%);
      transition: all .3s;
    }

    &:before {
      content: none;
    }
  }

  .btn-call {
    color: $call-btn-color;
    border: 1px solid $call-btn-color;

    &:hover {
      color: rgba($call-btn-color, 0.7);
      border-color: rgba($call-btn-color, 0.7);
      transition: all .3s;
    }
  }

  .yes-bg {
    display: none;
  }

  &.vote-yes {
    .cover {
      background: none;
    }

    .yes-bg {
      background: linear-gradient(90deg, rgba(55,191,164,1) 0%, rgba(53,118,173,1) 100%);
      opacity: 0.5;
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      z-index: 1;
    }

    h5 {
      z-index: 2;
    }
  }
}
</style>

<template>
  <div :class="{ 'politician': true, 'vote-yes': politician.yesOnCRA, 'long-name': isLong(politician.name) }">
    <img :src="imageURL(politician)" :srcset="imageURL(politician, '_x2') + ' 2x'">
    <div class="cover" @click="openTweetURL(politician)">
      <div class="yes-bg"></div>
      <h5>
        {{ politician.name }}
        <small>
          (<span v-if="politician.organization == 'Senate'">SEN </span><b v-if="politician.partyCode">{{ politician.partyCode.toUpperCase() }} - </b>{{ politician.stateCode }})
        </small>
      </h5>
    </div>
    <div class="actions">
      <a v-if="politician.twitter" class="btn btn-twitter" :href="tweetURL(politician)" target="_blank">Tweet</a>
      <a href="/call" class="btn btn-call">
        <span v-if="politician.calls">{{ politician.calls | pluralize('call') }}</span>
        <span v-else>No call data</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'politician'
  ],

  methods: {
    imageURL: function(pol, suffix='_x1') {
      return 'https://www.fightforthefuture.org/congress-images/' +  pol.biocode + suffix + '.jpg';
    },

    isLong: function(name) {
      return name.indexOf(' ') === -1 && name.length > 11;
    },

    tweetURL: function(pol) {
      var tweetText;

      if (pol.organization === 'Senate') {
        if (pol.yesOnCRA) {
          tweetText = `Thank you @${pol.twitter} for voting for the CRA to overrule the FCC and save our #NetNeutrality rules. Find out where your representatives stand and ask them to do the same! https://battleforthenet.com`
        }
        else {
          tweetText = `@${pol.twitter}, why didn’t you vote for the CRA to overrule the FCC and save our #NetNeutrality rules? This issue matters to me! (Friends: find out where your representatives stand and contact them at https://battleforthenet.com)`
        }
      }
      // House yes
      else if (pol.yesOnCRA) {
        tweetText = 'I am delighted that @' + pol.twitter + ' will be voting for the CRA to overrule the FCC and save our #NetNeutrality rules. Find out where your representatives stand and ask them to do the same! https://battleforthenet.com';
      }
      // House no
      else {
        tweetText = '@' + pol.twitter + ', why haven\'t you promised to vote for the CRA to overrule the FCC and save our #NetNeutrality rules? This issue matters to me! (Friends: find out where your representatives stand and contact them at https://battleforthenet.com)';
      }

      return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText);
    },

    openTweetURL: function(pol) {
      var url = this.tweetURL(pol);
      window.open(url, '_blank');
    }
  }
}
</script>
