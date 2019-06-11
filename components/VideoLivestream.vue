<style lang="scss" scoped>
$orange-color: #FF5627;

@keyframes fade-dot {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.video-wrapper {
  margin-top: 3rem;
}
.video-wrapper iframe {
  min-height: 360px;
  width: 100%;

  @include mobile {
    min-height: 230px;
  }
}
.placeholder {
  padding: 1.2rem 1.2rem 2.5rem;
  background: #000 url("~assets/images/video-placeholder.jpg") top center no-repeat;
  background-size: cover;
  border-radius: $border-radius;
  box-shadow: 0 5px 35px rgba(0,0,0,0.5);

  p.live {
    position: relative;
    margin: 0;
    padding-left: 1.6rem;
    color: $orange-color;
    font-size: 1.8rem;
    font-weight: 700;
    text-align: left;
    text-transform: uppercase;

    &:before {
      display: block;
      content: '';
      position: absolute;
      left: 0;
      top: 0.9rem;
      width: 1rem;
      height: 1rem;
      background-color: $orange-color;
      border-radius: 1rem;
      opacity: 1;
      animation: fade-dot 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) 2s infinite;
    }
  }

  h2 {
    color: #FFF;
    text-transform: uppercase;
  }

  h2.heading {
    margin: 6rem 0 5rem;

    @include mobile {
      min-height: 99px; // Require 3 lines on mobile
    }
  }

  h2.countdown {
    min-height: 4rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div id="watch">
    <h3 class="pad-top-3 push-top-0">
      Watch the <span v-if="!isCountdownLive && !isTwitchLive">archived</span>
      live stream right here 👇
    </h3>
    <div class="video-wrapper">
      <div class="placeholder" v-if="isCountdownLive && timeUntilLive > 0">
        <p class="live">Live</p>
        <transition name="fade" mode="out-in">
          <h2 class="heading" :key="headingIndex">{{ headings[headingIndex] }}</h2>
        </transition>
        <h2 class="countdown">
          <span v-if="isCountdownLive && now">{{ countdown }}</span>
        </h2> <!-- .countdown -->
      </div> <!-- .placeholder -->
      <div v-else-if="isTwitchLive">
        <iframe src="https://player.twitch.tv/?channel=fight_for_the_future"
                frameborder="0" scrolling="no"
                webkitallowfullscreen mozallowfullscreen allowfullscreen>
        </iframe>
        <iframe src="https://www.twitch.tv/embed/fight_for_the_future/chat"
                frameborder="0" scrolling="no">
        </iframe>
      </div>
      <div v-else>
        <iframe :src="`https://player.twitch.tv/?video=${archivedVideoId}&autoplay=false`"
                frameborder="0" scrolling="no"
                webkitallowfullscreen mozallowfullscreen allowfullscreen>
        </iframe>
      </div> <!-- v-else -->
    </div> <!-- .video-wrapper -->
  </div>
</template>

<script>
export default {
  props: {
    abbr: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      isCountdownLive: false,
      isTwitchLive: true,
      archivedVideoId: '409475111',
      now: null,
      headingIndex: 0,
      headings: [
        'Crucial net neutrality vote Wednesday',
        'Lobbyists are working to gut the bill',
        'Tell Congress to pass a clean bill'
      ]
    }
  },

  computed: {
    endDateTime () {
      return new Date('Wed April 3 2019 13:30:00 GMT+0000').getTime()
    },
    timeUntilLive() {
      if (this.now) {
        return this.endDateTime - this.now;
      }
    },
    countdown () {
      if (this.timeUntilLive) {
        if (this.timeUntilLive > 0) {
          const diff = {
            days: Math.floor(this.timeUntilLive / (1000 * 60 * 60 * 24)),
            hours: Math.floor((this.timeUntilLive % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((this.timeUntilLive % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((this.timeUntilLive % (1000 * 60)) / 1000)
          }
          const formattedTime = [
            String(diff.hours).padStart(2, '0'),
            String(diff.minutes).padStart(2, '0'),
            String(diff.seconds).padStart(2, '0')
          ]
          if (diff.days !== 0) { formattedTime.unshift(diff.days) }
          return formattedTime.join(':');
        } else {
          return '00:00:00'
        }
      }
    }
  },

  created() {
    this.startCountdown()
    this.headingTextRotation()
  },

  methods: {
    startCountdown() {
      let secondCountdown = setInterval(() => {
        this.now = new Date().getTime()
      }, 1000);
    },
    headingTextRotation() {
      let rotationCountdown = setInterval(() => {
        this.headingIndex = this.headings.length-1 !== this.headingIndex ? this.headingIndex+1 : 0
      }, 5000)
    }
  }
}
</script>
