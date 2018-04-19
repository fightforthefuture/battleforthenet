<style lang="scss">
.video-roll {
  position: relative;

  .video-scroller {
    overflow: hidden;
    width: 100%;
  }

  .video-container {
    transition: transform .3s;
  }

  .video {
    float: left;
    width: 35rem;
    margin-right: 1rem;
    position: relative;

    img.thumb {
      width: 35rem;
      height: 19rem;
      object-fit: cover;
    }

    h4 {
      margin: 0;
    }

    p {
      margin: 0;
      font-size: 1.5rem;
      line-height: 1.33;
    }

    button.play {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: transparent;
      border: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 19rem;
      background-color: rgba(0, 0, 0, 0.25);
      transition: background-color .3s;

      &:hover {
        background-color: transparent;
      }

      .circle {
        border: 3px solid #fff;
        background-color: #515470;
        width: 7.5rem;
        height: 7.5rem;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          height: 4rem;
          margin-left: .8rem;
        }
      }
    }
  }

  button.prev,
  button.next {
    line-height: 1;
    border: none;
    text-align: center;
    position: absolute;
    top: 0;
    height: 19rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;

    &:disabled {
      opacity: 0.25;
    }

    .circle {
      background: #494476;
      border-radius: 100%;
      width: 4.2rem;
      height: 4.2rem;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 1.8rem;
      }
    }

    &:hover:not(:disabled) .circle {
      background-color: #5f88ff;
    }
  }

  button.prev {
    left: -6rem;
  }

  button.next {
    right: -6rem;
  }

  .modal {
    background-color: transparent;
  }

  .video-iframe-container {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 35px;
    height: 0;
    overflow: hidden;

    iframe {
      position: absolute;
      top:0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  @include mobile {
    button.prev, button.next {
      display: none;
    }
  }
}
</style>

<template>
  <div class="video-roll" @touchstart="touchStart" @touchend="touchEnd">
    <div class="video-scroller">
      <div class="video-container" :style="{ width: `${totalWidth}px`, transform: translate3d }">
        <div v-for="video in videos" :key="video.video" class="video">
          <img class="thumb" :src="video.thumb" alt="">
          <h4>{{ video.heading }}</h4>
          <p>{{ video.subHeading }}</p>
          <button class="play" @click="showModal(video)">
            <div class="circle"><img src="~/assets/images/media-play.svg" alt="Play"></div>
          </button>
        </div>
      </div>
    </div>
    <button class="prev" @click="prevPage()" :disabled="page < 1">
      <div class="circle"><img src="~/assets/images/chevron-left.svg" alt="Previous"></div>
    </button>
    <button class="next" @click="nextPage()" :disabled="page >= lastPage">
      <div class="circle"><img src="~/assets/images/chevron-right.svg" alt="Next"></div>
    </button>

    <modal v-if="modalVideo">
      <div class="video-iframe-container">
        <iframe width="640" height="360" :src="modalVideo.video" frameborder="0" allowfullscreen></iframe>
      </div>
    </modal>
  </div>
</template>

<script>
import videos from '~/assets/data/videos.json'
const videoWidth = 360

export default {
  computed: {
    videos: () => videos,

    totalWidth: () => videos.length * videoWidth,

    lastPage() {
      return Math.ceil(this.totalWidth / videoWidth) - 1
    },

    translate3d() {
      const x = this.page * videoWidth * -1
      return `translate3d(${x/10}rem, 0, 0)`
    }
  },

  watch: {
    modalVisible(newValue) {
      if (!newValue) {
        this.modalVideo = null
      }
    }
  },

  data() {
    return {
      page: 0,
      modalVideo: null,
      modalVisible: true
    }
  },

  methods: {
    nextPage() {
      if (this.page < this.lastPage) {
        this.page++
      }
    },

    prevPage() {
      if (this.page > 0) {
        this.page--
      }
    },

    showModal(video) {
      this.modalVideo = video
      this.modalVisible = true
    },

    touchStart(event) {
      this.touchStartX = event.changedTouches[0].screenX
    },

    touchEnd(event) {
      const endX = event.changedTouches[0].screenX

      // swipe left
      if (endX < this.touchStartX) {
        this.nextPage()
      }
      // swipe right
      else if (endX > this.touchStartX) {
        this.prevPage()
      }
    }
  }
}
</script>
