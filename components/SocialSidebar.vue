<style lang="scss">
.social-sidebar {
  position: absolute;
  left: 0;
  top: 500px;
  z-index: 100;

  .btn {
    display: block;
    position: relative;
    height: 60px;
    width: 80px;
    border-radius: 0 30px 30px 0;
    margin-bottom: 10px;
    transition: width 0.2s ease-in;
    background-image: none;
    padding: 0;
    font-size: 16px;
    
    &:before {
      content: none;
    }

    span {
      font-family: $body-font;
      font-weight: bold;
      color: white;
      text-transform: uppercase;
      display: block;
      line-height: 60px;
      width: 200px;
      text-align: right;
      opacity: 0;
      position: absolute;
      right: 60px;
      transition: opacity 0.4s ease-in;
    }

    img {
      position: absolute;
      height: 50px;
      right: 15px;
      top: 5px;
    }

    &:hover {
      width: 250px;

      span {
        opacity: 1.0;
      }
    }
  }

  .twitter {
    background-color: $twitter-blue;
  }

  .facebook {
    background-color: $facebook-blue;
  }

  @include mobile {
    display: none;
  }
}
</style>

<template>
  <div class="social-sidebar">
    <twitter-button>
      <span>Share on Twitter</span>
      <img src="~/assets/images/twitter_white.svg" alt="">
    </twitter-button>
    <facebook-button>
      <span>Share on Facebook</span>
      <img src="~/assets/images/facebook_white.svg" alt="">
    </facebook-button>
  </div>
</template>