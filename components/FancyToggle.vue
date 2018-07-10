<style lang="scss">
.fancy-toggle {
  color: #6f6393;
  background-color: #302a44;
  border-radius: $border-radius;
  padding: .3rem;
  display: flex;
  align-items: center;
  width: 10rem;
  height: 4rem;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.3rem;
  position: relative;

  @include mobile {
    width: 150px;
  }

  .bg {
    position: absolute;
    top: 0.3rem;
    bottom: 0.3rem;
    right: 0.3rem;
    width: 48%;
    background-color: #493f62;
    z-index: 1;
    border-radius: $border-radius * 1.2;
    transition: background-color .2s, transform .1s;
  }

  &.yes .bg {
    transform: translate3d(-95%, 0, 0);
    background-color: #18beb4;
  }

  span {
    display: inline-block;
    flex: 1;
    transition: all .2s;
    z-index: 2;

  }

  &.yes span.no,
  &.no span.yes {
    &:hover {
      color: #fff;
      cursor: pointer;
    }
  }

  &.yes span.yes,
  &.no span.no {
    color: #fff;
  }
}
</style>

<template>
  <div class="fancy-toggle" :class="on ? 'yes' : 'no'">
    <div class="bg"></div>
    <span class="yes" @click="doChange(true)">Yes</span>
    <span class="no" @click="doChange(false)">No</span>
  </div>
</template>

<script>
export default {
  props: {
    on: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    doChange(flag) {
      this.$emit("change", flag);
    }
  }
}
</script>
