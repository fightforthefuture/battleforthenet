<style lang="scss">
body {
  color: $body-color;
  background-color: $body-bg-color;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 300;
  // background-color:
  // background: linear-gradient(90deg, rgba(14,193,201,1) 0%, rgba(60,64,211,1) 15%, rgba(133,33,158,1) 40%, rgba(170,33,110,1) 57%, rgba(209,70,40,1) 75%, rgba(209,186,85,1) 99%);
  // padding-top: 0.5rem;
}

b, strong {
  font-weight: 600;
}

h1, h2.section-title {
  white-space: pre-line;
}

h1 {
  margin: 0 0 2rem;
  font-size: 7rem;
}

h2.section-title {
  font-size: 4rem;
  background-image: url('~/assets/images/title-gradient.png');
  background-repeat: no-repeat;
  background-size: 15rem auto;
  background-position: center bottom;
  padding-bottom: 2rem;
}

.container {
  width: $container-width;
}

.page-header {
  background-image: url('~/assets/images/gradient-divider.png');
  background-position: top center;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-color: #282236;

  h1 {
    width: 140%;
    margin-left: -20%;
  }

  .intro p {
    font-size: 2rem;
    margin: 1rem auto;
  }

  // arrow
  // &:after {
  //   top: 100%;
  //   left: 50%;
  //   border: solid transparent;
  //   content: " ";
  //   height: 0;
  //   width: 0;
  //   position: absolute;
  //   pointer-events: none;
  //   border-color: transparent;
  //   border-top-color: #282236;
  //   border-width: 2.5rem;
  //   margin-left: -2.5rem;
  // }

  &.bg-image {
    background-image: url('~/assets/images/top-bg.png');
    background-size: cover;

    @media only screen and (min-width: 1001px) {
      background-image: url('~/assets/images/top-bg@2x.png');
    }
  }
}

section {
  padding: 6rem;
  background-color: $body-bg-color;

  &:nth-child(even) {
    background-color: $alt-bg-color;
  }

  ol {
    text-align: left;
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      border: 1px solid #544090;
      border-radius: 0.4rem;
      padding: 1rem 3rem;
      font-size: 90%;
      margin: 1rem;
      position: relative;

      &:before {
        content: "1";
        width: 3rem;
        height: 3rem;
        border-radius: 100%;
        font-weight: 700;
        text-align: center;
        background-color: #544090;
        position: absolute;
        left: -1.5rem;
        line-height: 3rem;
        top: 23%;
        font-size: 1.5rem;
      }

      @for $i from 2 through 8 {
        &:nth-child(#{$i}):before {
          content: "#{$i}";
        }
      }
    }
  }

  &.fill-height {
    @include big-screen {
      min-height: calc(100vh - #{$footer-height});
    }
  }
}

ul.basic-list {
  text-align: left;
  padding: 0 5rem;

  li {
    margin-bottom: 1.5rem;
  }
}

strong {
  color: #fff;
}

$light-blue: rgba(58,255,227,1);
$blue: rgba(62,147,218,1);
$purple: rgba(148,53,224,1);
$light-orange: rgba(241,99,90,1);
$orange: rgba(254,91,47,1);
$step: 6%;
// NOTE: this mixin is a workaround because CSS animations can't be restarted
@mixin button-gradient-animation {
  @for $i from 0 through 10 {
    #{$i*10%} {
      background: linear-gradient(
        #{106 - ($i*6)}deg,
        #{$light-blue} 0%,
        #{$blue} #{$i*$step},
        #{$purple} #{$i*$step + 29%},
        #{$light-orange} #{$i*$step + 79%},
        #{$orange} 100%
      );
    }
  }
}

@keyframes cta-hover {
  @include button-gradient-animation;
}
@keyframes cta-mouseout {
  @include button-gradient-animation;
}

.btn-cta {
  background: rgb(62,147,218);
  background: linear-gradient(
    106deg,
    $blue 0%,
    $purple 29%,
    $light-orange 79%,
    $orange 100%
  );
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  animation: cta-mouseout .2s;
  animation-fill-mode: forwards;
  animation-direction: reverse;

  &:hover {
    animation: cta-hover .2s;
    animation-fill-mode: forwards;
    animation-direction: normal;
  }
}

.btn-default {
  border: 1px solid $default-btn-color;
  color: $default-btn-color;
  background-color: transparent;
  transition: all .2s;

  &:hover {
    color: rgba($default-btn-color, 0.75);
    border-color: rgba($default-btn-color, 0.75);
    background-color: transparent;
  }
}

@include small-screen {
  h1 {
    font-size: 4rem;
    width: 100% !important;
    margin-left: 0 !important;
  }

  h2.section-title {
    font-size: 3.2rem;
  }

  .container {
    width: auto;
  }

  .page-header .intro p {
    font-size: 1.8rem;
  }

  section {
    padding: 3rem 0;
  }
}

@include daytons-lenovo {
  h1 {
    font-size: 5rem;
  }

  h2.section-title {
    font-size: 3.2rem;
  }

  section {
    padding: 4rem;
  }

  .page-header {
    padding-top: 4rem;

    .intro p {
      font-size: 1.8rem;
    }
  }
}
</style>

<template>
  <div>
    <nuxt/>
    <BFTNFooter v-if="hasFooter" />
  </div>
</template>

<script>
import BFTNFooter from '~/components/BFTNFooter'
import { createMetaTags } from '~/assets/js/helpers'

export default {
  components: {
    BFTNFooter
  },

  head() {
    return {
      title: this.$t('pages.index.document_title'),
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,600|Poppins:600,700'
        }
      ],
      meta: createMetaTags({
        title: this.$t('social.share_title'),
        description: this.$t('social.share_description'),
        image: this.$t('social.share_image'),
        url: this.$t('social.share_url')
      })
    }
  },

  computed: {
    hasFooter() {
      return this.$route.name !== 'map'
    }
  }
}
</script>
