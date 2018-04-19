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
    width: 350px;
    margin-right: 10px;
    position: relative;

    img.thumb {
      width: 350px;
      height: 190px;
      object-fit: cover;
    }

    h4 {
      margin: 0;
    }

    p {
      margin: 0;
      font-size: 92%;
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
      height: 190px;
      background-color: rgba(0, 0, 0, 0.25);
      transition: background-color .3s;

      &:hover {
        background-color: transparent;
      }

      .circle {
        border: 3px solid #fff;
        background-color: #515470;
        width: 75px;
        height: 75px;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          height: 40px;
          margin-left: 8px;
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
    height: 190px;
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
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 18px;
      }
    }

    &:hover:not(:disabled) .circle {
      background-color: #5f88ff;
    }
  }

  button.prev {
    left: -60px;
  }

  button.next {
    right: -60px;
  }

  .modal {
    background-color: transparent;
  }
}
</style>

<template>
  <div class="video-roll">
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
      <iframe width="640" height="360" :src="modalVideo.video" frameborder="0" allowfullscreen></iframe>
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
      return Math.ceil(this.totalWidth / videoWidth) - 2
    },

    translate3d() {
      const x = this.page * videoWidth * -1
      return `translate3d(${x}px, 0, 0)`
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
    }
  }
}
</script>