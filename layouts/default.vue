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

h1 {
  margin: 0 0 3rem;
  font-size: 6rem;
}

h2.section-title {
  font-size: 4rem;
  background-image: url('~/assets/images/title-gradient.png');
  background-repeat: no-repeat;
  background-size: 15rem auto;
  background-position: center bottom;
  padding-bottom: 1rem;
}

.container {
  width: $container-width;
}

.page-header {
  background-image: url('~/assets/images/top-bg.png');
  background-position: top center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #282236;
  position: relative;

  @media only screen and (min-width: 1001px) {
    background-image: url('~/assets/images/top-bg@2x.png');
  }

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
}

section {
  padding: 6rem;
  background-color: $body-bg-color;

  &:nth-child(even) {
    background-color: $alt-bg-color;
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

.btn-cta {
  background: rgb(62,147,218);
  background: linear-gradient(106deg, rgba(62,147,218,1) 0%, rgba(148,53,224,1) 29%, rgba(241,99,90,1) 79%, rgba(254,91,47,1) 100%);
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
    margin-bottom: 2rem;
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
    <BFTNFooter/>
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
  }
}
</script>
