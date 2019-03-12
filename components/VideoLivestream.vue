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
    <iframe src="https://www.youtube-nocookie.com/embed/Z94bOTBGLzM" frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            webkitallowfullscreen mozallowfullscreen allowfullscreen>
    </iframe>
  </div>
</template>
