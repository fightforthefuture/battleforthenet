<style lang="scss">
.battle-stats {
  .stat {
    color: #fff;
    font-size: 2rem;
    text-align: center;
    font-family: $title-font;
    font-weight: 600;
    margin-top: 1rem;
    display: flex;

    .value {
      font-weight: 700;
      background-color: #493c66;
      padding: 2rem;
      width: 30%;
      border-radius: $border-radius 0 0 $border-radius;
    }

    .label {
      width: 70%;
      padding: 2rem;
      position: relative;
      background-color: #2a233b;
      border-radius: 0 $border-radius $border-radius 0;

      &:after {
        right: 100%;
        top: 50%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
        border-color: rgba(136, 183, 213, 0);
        border-right-color: #2a233b;
        border-width: 10px;
        margin-top: -10px;
      }
    }

    @include small-screen {
      font-size: 2rem;

      .value {
        width: 40%;
        padding: 1.5rem;
      }

      .label {
        width: 60%;
        padding: 1.5rem;
      }
    }
  }
}
</style>

<template>
  <div class="battle-stats">
    <div class="stat" v-for="(stat, key) of stats" :key="key">
      <div class="value">
        <div class="flex-center">
          <countTo v-if="stat.startValue" :startVal="stat.startValue" :endVal="stat.endValue" :duration="3000"></countTo>
          <span v-else>{{ $lt('placeholder') }}</span>
        </div>
      </div>
      <div class="label">
        <div class="flex-center">
          {{ stat.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import countTo from 'vue-count-to'

export default {
  components: {
    countTo
  },

  data() {
    return {
      stats: {
        email: {
          label: this.$lt('email'),
          startValue: null,
          endValue: null
        },
        call: {
          label: this.$lt('call'),
          startValue: null,
          endValue: null
        },
        sms: {
          label: this.$lt('sms'),
          startValue: null,
          endValue: null
        },
        web: {
          label: this.$lt('web'),
          startValue: null,
          endValue: null
        },
        biz: {
          label: this.$lt('biz'),
          startValue: null,
          endValue: null
        }
      }
    }
  },

  created() {
    this.fetchStats()
    this.statsInterval = setInterval(this.fetchStats, 3000)
  },

  destroyed() {
    clearInterval(this.statsInterval)
  },

  methods: {
    $lt(key) {
      return this.$t(`components.BattleStats.${key}`)
    },

    async fetchStats() {
      const { data } = await axios.get('https://data.battleforthenet.com/stats.json')
      for (let key of Object.keys(data)) {
        const stat = this.stats[key]
        if (stat) {
          stat.startValue = stat.endValue || data[key]
          stat.endValue = data[key]
        }
      }
    }
  }
}
</script>
