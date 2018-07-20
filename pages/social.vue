<style lang="scss">
$item-width: 25rem;
$item-padding: 2rem;

.social-page {
  .page-header {
    min-height: 100vh;
  }

  .gallery {
    width: 90%;
    max-width: ($item-width + $item-padding) * 3;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    margin: 4rem auto;

    @include mobile {
      width: 100%;
    }

    .item {
      background-color: #181421;
      width: $item-width;
      height: $item-width;
      margin: 1rem;
      padding: 3rem;
      border-radius: 16px;
      position: relative;
      color: inherit;

      label {
        position: absolute;
        top: 1rem;
        left: 2rem;
        right: 2rem;
        font-size: 1.2rem;
        width: $item-width - 4rem;
      }

      img {
        max-width: 16rem;
        max-height: 16rem;
        margin-bottom: 3rem;
        margin-top: 1rem;
      }

      .btn {
        background-color: #403657;
        border-radius: 16px;
        font-size: 1.3rem;
        position: absolute;
        bottom: 1.2rem;
        left: 2rem;
        right: 2rem;
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;

        &:after {
          content: "";
          background-image: url("~/assets/images/download.svg");
          background-size: 100% auto;
          background-repeat: no-repeat;
          height: 1.5rem;
          width: 1.5rem;
          margin-left: 0.5rem;
        }
      }

      &:hover {
        cursor: pointer;
        background-color: lighten(#181421, 2%);
        transform: scale(1.02);
        transition: background-color .3s, transform .2s;

        .btn {
          background-color: lighten(#403657, 10%);
          transition: background-color .2s;
        }
      }
    }
  }
}
</style>

<template>
  <div class="social-page">
    <section class="page-header">
      <div class="container">
        <h1>{{ $lt('title') }}</h1>
        <div v-html="$lt('intro_html')" class="intro"></div>
      </div>
      <div class="gallery">
        <a v-for="image in images" :key="image" class="item flex-center" :href="image" target="_blank">
          <label class="truncate">{{ imageLabel(image) }}</label>
          <img :src="`${image}`" :alt="image">
          <span class="btn">{{ $lt('download_button') }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import images from '~/assets/data/social-media-assets'

export default {
  computed: {
    images: () => images
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.social.${key}`, vars)
    },

    imageLabel(image) {
      return image.split('/').pop().split('@')[0].replace(/\.(png|jpg|jpeg|gif)$/i, '')
    }
  }
}
</script>
