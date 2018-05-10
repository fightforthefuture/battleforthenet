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
    <div class="stat" v-for="stat in stats" :key="stat.label">
      <div class="value">
        <div class="flex-center">
          {{ stat.value | formatNumber }}
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
import stats from '~/assets/data/battle-stats.json'

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export default {
  computed: {
    stats() {
      return [
        {
          value: rand(1000, 10000000),
          label: 'Emails sent to Congress'
        },
        {
          value: rand(1000, 10000000),
          label: 'Phone calls made to Congress'
        },
        {
          value: rand(1000, 10000000),
          label: 'Messages sent to Congress by text'
        },
        {
          value: stats.bizCount,
          label: 'Businesses supporting the CRA'
        }
      ]
    }
  }
}
</script>
