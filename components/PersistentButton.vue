<style lang="scss">
  .persistent-button {
    z-index: 1983;
    position: fixed;
    bottom: 2.5rem;
    right: 2.5rem;
    transform: translate3d(0, 200%, 0);
    transition: transform 0.2s ease-in;

    .btn {
      display: block;
      letter-spacing: 0.25rem;
      font-size: 4rem;
      padding: 3rem 2rem;
      white-space: normal;
      width: 35rem;
      box-shadow: .5rem .5rem 3.5rem rgba(0, 0, 0, 1.0);
      transition: box-shadow 0.3s ease-in;
      background: linear-gradient(106deg, rgba(31,90,208,1) 0%, rgba(104,28,179,1) 36%, rgba(165,59,91,1) 76%);

      @include small-screen {
        white-space: nowrap;
        font-size: 2.5rem;
        padding: 1.5rem 0;
        width: 100%;
      }

      &.btn-phone {
        background-image: url('~/assets/images/phone.svg');
        background-repeat: no-repeat;
        background-size: 4rem auto;
        background-position: 1.2rem center;
        padding-left: 6rem;
      }

      &:hover {
        color: #fff;
        box-shadow: 1rem 1rem 3.5rem rgba(0, 0, 0, 1.0);
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
        border-radius: 0;
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
