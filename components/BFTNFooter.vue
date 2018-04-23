<style lang="scss">
.bftn-footer {
  background-color: #1f1c35;
  padding: 3rem 3rem 0;
  margin-top: 10rem;

  .logos {
    padding: 2rem 0 3rem;
    border-bottom: .2rem solid $border-color;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: row wrap;

    img {
      max-width: 240px;
      height: 50px;
      object-fit: contain;
      margin: 0 2rem;
    }

    a.freepress img {
      margin-top: -1rem;
    }

    @include small-screen {
      padding-top: 0;

      a.freepress img {
        margin-top: 0;
      }
    }
  }

  .press-inquiries {
    width: 65%;
    float: left;
    padding-top: 1rem;
    font-weight: bold;
    color: $muted-text-color;

    h3 {
      color: $header-color;
      font-size: 1.8rem;
    }

    p {
      font-size: 1.5rem;
    }

    @include small-screen {
      width: auto;
      float: none;
    }
  }

  .social-media {
    float: right;
    width: 35%;

    @include small-screen {
      float: none;
      width: auto;
      height: auto;
      margin: 0;
    }

    .btn {
      display: block;
      width: 100%;
      font-weight: bold;
      font-size: 1.4rem;
      position: relative;
      color: #FFF;
      text-decoration: none;
      cursor: pointer;
      height: 5rem;
      padding: 0 4.5rem 0 1.5rem;
      line-height: 5rem;
      border-radius: 2.5rem;
      text-transform: uppercase;
      text-align: center;
      background-image: none;
      white-space: nowrap;

      &:before {
        content: none;
      }

      span {
        margin-left: 0.5rem;
      }

      img {
        position: absolute;
        height: 4rem;
        top: .5rem;
        right: 1.5rem;
      }

      &:first-child {
        margin-top: 7rem;
        margin-bottom: 1rem;

        @include small-screen {
          margin: 2rem 0 1rem;
        }
      }
    }
  }

  .built-by {
    font-weight: bold;
    text-align: center;
    width: 30rem;
    margin: 4rem auto 0;
    background-color: $body-bg-color;
    padding: 2rem 0 3rem;
    color: $muted-text-color;
    border-radius: $border-radius $border-radius 0 0;
    font-size: 1.6rem;

    span {
      margin-right: .5rem;
    }

    img {
      width: 14.4rem;
    }

    @include small-screen {
      padding-bottom: 10rem;
    }
  }
}
</style>

<template>
  <footer class="bftn-footer">
    <div class="container">
      <div class="logos">
        <a class="fftf" href="https://www.fightforthefuture.org/">
          <img src="~/assets/images/fftf-dark.svg" alt="Fight for the Future">
        </a>
        <a class="demandprogress" href="https://demandprogress.org/">
          <img src="/images/v2/footer-demandprogress-logo.png" srcset="/images/v2/footer-demandprogress-logo-x2.png 2x" alt="Demand Progress">
        </a>
        <a class="freepress" href="https://www.freepress.net/">
          <img src="/images/v2/footer-freepress-logo.png" srcset="/images/v2/footer-freepress-logo-x2.png 2x" alt="Free Press">
        </a>
      </div>
      <div class="clearfix">
        <div class="press-inquiries">
          <h3>For Press inquiries, please contact us at:</h3>
          <p>
            <a href="tel://1-978-852-6457">978-852-6457</a> or <a href="tel://1-978-852-6457">978-852-6457</a> or <a href="mailto:press@fightforthefuture.org">press@fightforthefuture.org</a><br />
            <a href="tel://1-201-533-8838">201-533-8838</a> or <a href="mailto:tkarr@freepress.net">tkarr@freepress.net</a><br />
            <a href="tel://1-202-681-7582">202-681-7582</a> or <a href="mailto:press@demandprogress.org">press@demandprogress.org</a>
          </p>
          <p>All other inquiries, contact <a href="mailto:team@fightforthefuture.org">team@fightforthefuture.org</a></p>
        </div>
        <div class="social-media">
          <twitter-button>
            <span>Share on Twitter</span>
            <img src="~/assets/images/twitter_white.svg" alt="">
          </twitter-button>
          <facebook-button>
            <span>Share on Facebook</span>
            <img src="~/assets/images/facebook_white.svg" alt="">
          </facebook-button>
        </div>
      </div>
      <div class="built-by">
        <div class="flex-center">
          <span>Built by:</span> <img src="~/assets/images/fftf-dark.svg" alt="Fight for the Future">
        </div>
      </div>
    </div>
  </footer>
</template>
