<style lang="scss">
$item-width: 25rem;
$item-padding: 2rem;

.media-page {
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
        left: $item-padding;
        right: $item-padding;
        font-size: 1.2rem;
        width: $item-width - ($item-padding * 2);
      }

      img {
        max-width: $item-width * .64;
        max-height: $item-width * .64;
        margin-bottom: 3rem;
        margin-top: 1rem;
      }

      .btn {
        background-color: #403657;
        border-radius: 16px;
        font-size: 1.3rem;
        position: absolute;
        bottom: 1.2rem;
        left: $item-padding;
        right: $item-padding;
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
  <div class="media-page">
    <section class="page-header">
      <div class="container">
        <h1>{{ $lt('title') }}</h1>
        <div v-html="$lt('intro_html')" class="intro"></div>
      </div>
    </section>
    <section v-for="(section, id) in $lt('sections')" :key="id" :id="id">
      <div class="container" v-if="section.title">
        <h2>{{ section.title }}</h2>
        <div v-html="section.body_html" v-if="section.body_html"></div>
      </div>
      <div class="gallery">
        <a v-for="image in galleries[id]" :key="image" class="item flex-center" :href="image" target="_blank">
          <label class="truncate">{{ imageLabel(image) }}</label>
          <img :src="`${image}`" :alt="image">
          <span class="btn">{{ $lt('download_button') }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import galleries from '~/assets/data/media'

export default {
  computed: {
    galleries: () => galleries
  },

  methods: {
    $lt(key, vars={}) {
      return this.$t(`pages.media.${key}`, vars)
    },

    imageLabel(image) {
      return image.split('/').pop().split('@')[0].replace(/\.(png|jpg|jpeg|gif)$/i, '')
    }
  }
}
</script>
