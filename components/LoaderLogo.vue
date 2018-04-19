<style lang="scss" scoped>
.loader-container {
  width: 60px;
  height: 29px;
  margin: 20px auto;
  position: relative;
}

.loader {
  width: 60px;
  height: 60px;
  position: relative;
  top: 20px;

  .chord {
    position: absolute;
    width: 60px;
    height: 6px;
    transition: opacity 0.05s;
  }

  .ray {
    display: block;
    height: 6px;
    width: 18px;
    background-color: $HEADER_COLORA;
    border-radius: 3px;
  }

  .chord-a { transform: rotate(0deg); }
  .chord-b { transform: rotate(45deg); }
  .chord-c { transform: rotate(90deg); }
  .chord-d { transform: rotate(135deg); }
  .chord-e { transform: rotate(180deg); }
  .chord-f { transform: rotate(225deg); }
  .chord-g { transform: rotate(270deg); }
  .chord-h { transform: rotate(315deg); }
  .chord-0 { opacity: 1.0; }
  .chord-1 { opacity: 0.9; }
  .chord-2 { opacity: 0.8; }
  .chord-3 { opacity: 0.7; }
  .chord-4 { opacity: 0.6; }
  .chord-5 { opacity: 0.5; }
  .chord-6 { opacity: 0.4; }
  .chord-7 { opacity: 0.3; }
}
</style>

<template>
  <div class="loader-container">
    <div class="loader">
      <div v-for="(chord, i) in chords" :key="i" :class="`chord chord-${chord} chord-${(index + chords.length - i + 1) % chords.length}`">
        <span class="ray"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chords: 'abcdefgh'.split(''),
      index: 0
    }
  },

  created() {
    this.spinner = setInterval(this.spin, 150)
  },

  destroyed() {
    clearInterval(this.spinner)
  },

  methods: {
    spin() {
      this.index = (this.index + 1) % this.chords.length
    }
  }
}
</script>
