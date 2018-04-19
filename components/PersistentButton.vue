<style lang="scss">
  .persistent-button {
    z-index: 1983;
    position: fixed;
    bottom: 25px;
    right: 25px;
    transform: translate3d(0, 200%, 0);
    transition: transform 0.2s ease-in;

    .btn {
      display: block;
      white-space: nowrap;
      font-size: 4rem;
      padding: 1.5rem;
      box-shadow: 5px 5px 35px rgba(0, 0, 0, 1.0);
      transition: box-shadow 0.3s ease-in;

      &.btn-phone {
        background-image: url('~/assets/images/phone.svg');
        background-repeat: no-repeat;
        background-size: 50px auto;
        background-position: 20px center;
        padding-left: 80px;
      }

      &:hover {
        color: #fff;
        box-shadow: 10px 10px 35px rgba(0, 0, 0, 1.0);
      }
    }

    &.visible {
      transform: translate3d(0, 0, 0);
    }

    @include mobile {
      bottom: 0;
      right: 0;
      left: 0;

      .btn {
        box-shadow: none;
      }
    }
  }
</style>

<template>
  <div class="persistent-button" :class="{ visible: isVisible }">
    <slot></slot>
  </div>
</template>

<script>
const desktopTop = 550
const mobileTop = 800
const desktopWidth = 930

export default {
  data() {
    return {
      isVisible: false
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll() {
      // IE11 uses pageYOffset. everything else uses scrollY
      const scrollY = window.scrollY || window.pageYOffset

      const isMobile = window.innerWidth < desktopWidth
      const top = isMobile ? mobileTop : desktopTop
      this.isVisible = scrollY > top
    },
  }
}
</script>