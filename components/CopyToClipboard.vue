<style lang="scss" scoped>
.embed-code {
  position: relative;
  overflow: hidden;

  input {
    padding-right: 75px; // NOTE: Magic number
    border-radius: $border-radius + 1;
    font-family: monospace;
    font-size: 1.4rem;
    word-wrap: break-word;
  }

  .btn-copy {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }
}
</style>

<template>
  <div class="embed-code">
    <button
      :data-clipboard-text="textToCopy"
      class="btn btn-copy js-clipboard"
      v-text="buttonText">
    </button>

    <input type="text" :value="textToCopy" readonly />
  </div> <!-- .embed-code -->
</template>

<script>
import Clipboard from 'clipboard'

export default {
  props: {
    textToCopy: {
      type: String
    }
  },

  data() {
    return {
      hasRecentlyCopied: false
    }
  },

  computed: {
    buttonText() {
      return this.hasRecentlyCopied ? this.$lt('copied_button_text') : this.$lt('copy_button_text')
    }
  },

  mounted () {
    let clipboard = new Clipboard('.js-clipboard')
    let self = this
    clipboard.on('success', function(ev) {
      self.successNotification()
      ev.clearSelection()
    })
  },

  methods: {
    $lt(key) {
      return this.$t(`components.CopyToClipboard.${key}`)
    },
    successNotification() {
      let self = this
      this.hasRecentlyCopied = true
      // WARNING: Since there is no server a setTimeout is ok. However, with a
      // server this is a dangerous eval. Remove if this project ever is hosted
      // with a JS server.
      setTimeout(function(){
        self.hasRecentlyCopied = false
      }, 2000)
    }
  }
}
</script>
