<template>
  <a class="btn btn-donate" :href="donateLink" @click="$emit('clicked')"><slot>Donate</slot></a>
</template>

<script>
export default {
  computed: {
    donateLink() {
      switch (this.$store.state.org) {
        case 'fp':
          return "https://freepress.actionkit.com/donate/single/"
        case "dp":
          return "https://secure.actblue.com/donate/nndayofaction?refcode=20170712-bftn"
        case "fftf":
        default:
          return "https://donate.fightforthefuture.org"
      }
    }
  }
}
</script>
