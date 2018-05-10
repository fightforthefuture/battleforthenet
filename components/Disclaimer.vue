<template>
  <p class="disclaimer">
    <small>
      <a v-if="org == 'dp'" target="_blank" href="https://www.demandprogress.org">Demand Progress</a>
      <a v-else-if="org == 'fp'" target="_blank" href="https://www.freepress.net">Free Press</a>
      <a v-else target="_blank" href="https://www.fightforthefuture.org">Fight for the Future</a>
      <span v-if="sms"> will email you updates, and you can unsubscribe at any time. If you enter your number (it's optional) we will follow up by SMS. Message &amp; data rates apply. You can always text STOP to stop receiving messages.</span>
      <span v-else> will email you updates, and you can unsubscribe at any time.</span>
      &nbsp;
      <a target="_blank" href="/privacy">Privacy Policy</a>
    </small>
  </p>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['org']),

  props: {
    sms: {
      type: Boolean,
      default: false
    }
  }
}
</script>
