<style lang="scss">
.bftn-footer {
  background: rgb(31,90,208);
  background: linear-gradient(106deg, rgba(31,90,208,1) 0%, rgba(104,28,179,1) 36%, rgba(165,59,91,1) 76%);
  padding: 3rem 3rem 0;

  a {
    color: #09a0ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .logos {
    padding-bottom: 2rem;
    border-bottom: 1px solid #7f6bae;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: row wrap;

    a {
      flex: 1;
      margin-right: 1rem;

      &:last-child {
        margin-right: 0;
      }
    }

    @include small-screen {
      padding-top: 0;
    }
  }

  .press-inquiries {
    width: 65%;
    float: left;
    padding-top: 1rem;
    font-weight: bold;
    text-align: left;

    @include small-screen {
      width: auto;
      float: none;

      h3 {
        font-size: 1.6rem;
      }
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
      font-size: 1.3rem;
      position: relative;
      color: #FFF;
      text-decoration: none;
      cursor: pointer;
      height: 5rem;
      padding: 0 4.7rem 0 1.5rem;
      line-height: 5rem;
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
        right: 1rem;
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
    width: 30rem;
    margin: 4rem auto 0;
    background-color: #521a93;
    padding: 2rem 0;
    border-radius: $border-radius $border-radius 0 0;
    font-size: 1.2rem;
    font-weight: 600;

    span {
      display: block;
      text-transform: uppercase;
    }

    img {
      width: 14.4rem;
    }
  }
}

@include small-screen {
  body.has-persistent-button .bftn-footer .built-by {
    padding-bottom: 10rem;
  }
}
</style>

<template>
  <footer class="bftn-footer">
    <div class="container">
      <h3><nuxt-link to="/">Battle for the Net</nuxt-link> is a project of:</h3>
      <div class="logos">
        <a class="fftf" href="https://www.fightforthefuture.org/">
          <img src="~/assets/images/fftf-dark.svg" alt="Fight for the Future">
        </a>
        <a class="demandprogress" href="https://demandprogress.org/">
          <img src="/images/v2/footer-demandprogress-logo.png" srcset="/images/v2/footer-demandprogress-logo-x2.png 2x" alt="Demand Progress">
        </a>
        <a class="freepress" href="https://www.freepress.net/">
          <img src="~/assets/images/fp-footer-logo.png" alt="Free Press Action Fund">
        </a>
      </div>
      <div class="clearfix">
        <div class="press-inquiries">
          <h3>For Press inquiries, please contact us at:</h3>
          <p>
            <a href="tel://5083683026">508-368-3026</a> or <a href="mailto:press@fightforthefuture.org">press@fightforthefuture.org</a><br />
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
        <span>Built by:</span>
        <a href="https://www.fightforthefuture.org/"><img src="~/assets/images/fftf-dark.svg" alt="Fight for the Future"></a>
      </div>
    </div>
  </footer>
</template>
