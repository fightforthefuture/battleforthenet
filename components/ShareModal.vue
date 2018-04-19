<style lang="scss">
body.modal-open {
  overflow: hidden;
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  overflow: scroll;
  animation: fade-in .2s;
}

.modal {
  width: 700px;
  margin: auto;
  position: relative;
  background-color: #fff;
  color: #06032e;
  padding: 15px 30px;
  border-radius: 8px;

  h2 {
    color: #06032e;
  }

  .btn-facebook {
    margin-right: 5px;
  }

  .close {
    position: absolute;
    right:6px;
    top: -3px;
    color: #fff;
    font-size: 36px;
    text-decoration: none;
    background-color: transparent;
    color: #06032e;
    border:none;
  }
}
</style>

<template>
  <div class="modal-wrapper" v-if="modalVisible">
    <div class="flex-center">
      <div class="modal text-center">
        <button class="close" @click="hideModal()">&times;</button>

        <h2>Thanks so much for your support!</h2>
        <p>Now, can you help us spread the word?</p>

        <div class="share">
          <button class="btn btn-facebook" @click.prevent="shareOnFacebook()">Share on Facebook</button>
          <button class="btn btn-tweet" @click.prevent="shareOnTwitter()">Share on Twitter</button>
        </div>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getMetaContent, openPopup } from '~/assets/js/helpers'

export default {
  computed: mapState(['modalVisible']),

  methods: {
    ...mapMutations([
      'showModal',
      'hideModal'
    ]),

    shareOnFacebook() {
      const url = getMetaContent('og:url')
      openPopup('https://www.facebook.com/sharer.php?u=' + encodeURIComponent(url), 'facebook')
    },

    shareOnTwitter: function() {
      const tweetText = getMetaContent('twitter:description') + ' ' + getMetaContent('twitter:url')
      openPopup('https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText), 'twitter')
    },
  }
}
</script>