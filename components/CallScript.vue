<template>
  <div>
    <h2>Calling you now!</h2>
    <p><strong>Introduce yourself, be polite, and say:</strong></p>
    <blockquote>“I support Title Two net neutrality and I urge you to use the Congressional Review Act to pass a "resolution of disapproval" reversing the FCC's December vote to repeal the Open Internet Order.”</blockquote>
    <div class="tip">
      If lines are busy, we may call you in a few minutes.
    </div>
    <footer>
      <h4>Done calling? Do these things, too!</h4>
      <div class="buttons">
        <div class="flex-row">
          <facebook-button>Share</facebook-button>
          <twitter-button>Tweet</twitter-button>
          <a class="btn btn-donate" :href="donateLink">Donate</a>
        </div>
        <div class="flex-row">
          <a class="btn btn-events" href="https://events.battleforthenet.com/" target="_blank">Find a protest near you</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getDonateLink } from '~/assets/js/helpers'

export default {
  computed: {
    ...mapState(['org']),

    donateLink() {
      return getDonateLink(this.org)
    }
  }
}
</script>