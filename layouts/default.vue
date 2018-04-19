<script>
import BFTNFooter from '~/components/BFTNFooter'

export default {
  components: {
    BFTNFooter
  }
}
</script>

<template>
  <div>
    <nuxt/>
    <BFTNFooter/>

    <!-- Sentry error reporting -->
    <!-- <script src="https://cdn.ravenjs.com/3.22.3/raven.min.js" crossorigin="anonymous"></script>
    <script type="text/javascript">
      if (typeof Raven !== 'undefined') Raven.config('https://a9a3a247f4804059a192eaad9fff3231@sentry.io/294926').install();
    </script> -->
  </div>
</template>