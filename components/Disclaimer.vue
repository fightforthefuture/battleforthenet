<template>
  <p class="disclaimer">
    <small v-if="org == 'dp'">
      <a target="_blank" href="https://www.demandprogress.org">Demand Progress</a> will email you updates, and you can unsubscribe at any time. If you enter your number (it's optional) we will follow up by SMS. Message &amp; data rates apply. You can always text STOP to stop receiving messages.
      <a target="_blank" href="/privacy">Privacy Policy</a>
    </small>
    <small v-else-if="org == 'fp'">
      <a target="_blank" href="https://www.freepress.net">Free Press</a> will contact you about important net neutrality updates.
      <a target="_blank" href="/privacy">Privacy Policy</a>
    </small>
    <small v-else-if="sms">
      <a target="_blank" href="https://www.fightforthefuture.org">Fight for the Future</a> will email you updates, and you can unsubscribe at any time. If you enter your number (it's optional) we will follow up by SMS. Message &amp; data rates apply. You can always text STOP to stop receiving messages.
      <a target="_blank" href="/privacy">Privacy Policy</a>
    </small>
    <small v-else>
      <a target="_blank" href="https://www.fightforthefuture.org">Fight for the Future</a> will contact you about important net neutrality updates.
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
