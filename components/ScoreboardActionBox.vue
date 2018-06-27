<style lang="scss">
.scoreboard-action-box {
  background-color: #2b253b;
  color: #fff;
  padding: 2rem;
  max-width: 45rem;
  border-radius: $border-radius;
  border: 1px solid #403857;
  margin: 3rem auto;

  h3 {
    text-transform: uppercase;
    font-size: 2rem;
    margin: 0;
  }

  p {
    margin-top: 0;
    font-size: 1.4rem;
  }

  .btn {
    background-color: #635686;
    font-size: 2.2rem;
    display: block;
    padding: 2rem;

    &:hover {
      background-color: darken(#635686, 5%);
      transition: background-color .2s;
    }
  }

  .stats {
    color: #635686;
    display: block;
    text-transform: uppercase;
    margin: 0.5rem 0 0;
    font-weight: bold;
  }
}
</style>

<template>
  <div class="scoreboard-action-box">
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <a v-if="cta_button" class="btn" :href="cta_url" @click="clickButton()">{{ cta_button }}</a>
    <small v-if="stats" class="stats">{{ stats }}</small>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    cta_button: String,
    stats: String,
    cta_url: {
      type: String,
      default: '#none'
    }
  },

  methods: {
    clickButton() {
      this.$trackEvent(`scoreboard-action-box-${this.cta_button.toLowerCase().replace(/\s/g, '-')}`, 'click')
      this.$emit('clicked')
    }
  }
}
</script>
