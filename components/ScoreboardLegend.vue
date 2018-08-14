<style lang="scss" scoped>
.legend {
  font-size: 1.8rem;
  background-color: #171321;
  border-radius: $border-radius;
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;

  @include small-screen {
    display: block;

    .team-cable {
      margin-bottom: 1rem;
    }
  }

  label {
    color: #fff;
    padding: .5rem 1.5rem;
    font-weight: 600;
    border-radius: $border-radius;
    min-width: 7rem;
  }

  .team-cable, .team-internet {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding: 0 0.5rem;

    span {
      line-height: 1.1;
      display: inline-block;
      font-size: 1.6rem;
      padding-left: 1rem;
      text-align: left;
    }
  }

  .team-cable {
    color: #ff2a2a;

    label {
      background: linear-gradient(90deg, rgba(255,74,74,1) 0%, rgba(255,56,56,1) 100%);
    }
  }

  .team-internet {
    color: #0cdbb1;

    label {
      background: linear-gradient(90deg, rgba(55,191,164,1) 0%, rgba(53,118,173,1) 100%);
    }
  }
}
</style>

<template>
  <div class="legend">
    <div class="team-cable">
      <label>{{ $lt('against_label') }}</label>
      <span>=</span>
      <span>{{ againstDescription }}</span>
    </div>
    <div class="team-internet">
      <label>{{ $lt('supports_label') }}</label>
      <span>=</span>
      <span>{{ supportsDescription }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: [ 'against', 'supports' ],

  computed: {
    againstDescription() {
      return this.against || this.$lt('against_description')
    },

    supportsDescription() {
      return this.supports || this.$lt('supports_description')
    }
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`components.ScoreboardLegend.${key}`, vars)
    }
  }
}
</script>
