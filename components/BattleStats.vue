<style lang="scss">
.battle-stats {
  .stat {
    color: #fff;
    font-size: 2.8rem;
    text-align: center;
    font-family: $title-font;
    margin-top: 1rem;
    display: flex;

    .value {
      font-weight: 700;
      background-color: #1cc89a;
      padding: 2rem;
      width: 30%;
    }

    .label {
      width: 70%;
      padding: 2rem;
      position: relative;
      background-color: #333358;

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
        border-right-color: #333358;
        border-width: 10px;
        margin-top: -10px;
      }
    }

    @include small-screen {
      font-size: 2rem;

      .value {
        width: 40%;
      }

      .label {
        width: 60%;
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
          <span v-if="stat.value">{{ stat.value | formatNumber }}</span>
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

export default {
  data() {
    return {
      stats: {
        email: {
          value: null,
          label: this.$lt('email')
        },
        call: {
          value: null,
          label: this.$lt('call')
        },
        sms: {
          value: null,
          label: this.$lt('sms')
        },
        // sigs: {
        //   value: null,
        //   label: this.$lt('sigs')
        // },
        biz: {
          value: null,
          label: this.$lt('biz')
        }
      }
    }
  },

  created() {
    this.fetchStats()
    // this.statsInterval = setInterval(this.fetchStats, 3000)
  },

  destroyed() {
    clearInterval(this.statsInterval)
  },

  methods: {
    $lt(key) {
      return this.$t(`components.BattleStats.${key}`)
    },

    async fetchStats() {
      const { data } = await axios.get('https://signatures-api.herokuapp.com/stats.json')
      for (let key of Object.keys(data)) {
        if (this.stats[key]) {
          this.stats[key].value = data[key]
        }
      }
    }
  }
}
</script>
