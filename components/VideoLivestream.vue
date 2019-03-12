<style lang="scss" scoped>
.video-wrapper {
  margin-top: 2rem;
}
.video-wrapper iframe {
  min-height: 360px;
  width: 100%;

  @include mobile {
    min-height: 230px;
  }
}
</style>

<template>
  <div class="video-wrapper">
    <iframe src="https://player.vimeo.com/video/323205772" frameborder="0"
            webkitallowfullscreen mozallowfullscreen allowfullscreen>
    </iframe>
  </div>
</template>
