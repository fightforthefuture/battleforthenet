<style lang="scss">
.bftn-footer {
  background-color: #1f1c35;
  padding: 3rem 3rem 0;
  margin-top: 10rem;

  .logos {
    padding: 2rem 0;
    border-bottom: 2px solid #393558;
    text-align: center;

    a {
      line-height: 6.2rem;

      @include mobile {
        line-height: auto;
      }
    }

    .fftf {
      margin-right: 4rem;
      position: relative;
      top: -0.6rem;
    }

    .demandprogress {
      position: relative;
      top: .8rem;
      margin-right: 4rem;
    }
  }

  .press-inquiries {
    width: 65%;
    float: left;
    padding-top: 1rem;
    font-weight: bold;
    color: #717093;

    @include mobile {
      width: auto;
      float: none;
    }

    ul {
      font-weight: bold;
      list-style-type: none;
      padding: 0;

      li {
        margin: 0 0 .8rem 0;
      }
    }
  }

  .social-media {
    float: left;
    height: 9rem;
    width: 30%;
    margin-left: 5%;

    @include mobile {
      float: none;
      width: auto;
      height: auto;
      margin: 0;
    }

    .btn {
      display: block;
      width: 100%;
      font-weight: bold;
      font-size: 14px;
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

        @include mobile {
          margin: 2rem 0 1rem;
        }
      }
    }
  }

  .built-by {
    clear: both;
    font-weight: bold;
    text-align: center;
    width: 30rem;
    margin: 4rem auto 0;
    background-color: #171629;
    padding: 2rem 0 4rem;
    line-height: 1em;
    color: #717093;
    border-radius: $border-radius $border-radius 0 0;

    span {
      margin-right: .5rem;
    }

    img {
      position: relative;
      top: .2rem;
    }

    @include mobile {
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
          <img src="/images/v2/footer-fftf-logo.png" srcset="/images/v2/footer-fftf-logo-x2.png 2x" />
        </a>
        <a class="demandprogress" href="https://demandprogress.org/">
          <img src="/images/v2/footer-demandprogress-logo.png" srcset="/images/v2/footer-demandprogress-logo-x2.png 2x" />
        </a>
        <a class="freepress" href="https://www.freepress.net/">
          <img src="/images/v2/footer-freepress-logo.png" srcset="/images/v2/footer-freepress-logo-x2.png 2x" />
        </a>
      </div>
      <div class="clearfix">
        <div class="press-inquiries">
          <h3>For Press inquiries, please contact us at:</h3>
          <p>
            <a href="tel://1-978-852-6457">978-852-6457</a> or <a href="tel://1-978-852-6457">978-852-6457</a> or <a href="mailto:press@fightforthefuture.org">press@fightforthefuture.org</a><br />
            <a class="no-em" href="tel://1-201-533-8838">201-533-8838</a> or <a href="mailto:tkarr@freepress.net">tkarr@freepress.net</a><br />
            <a class="no-em" href="tel://1-202-681-7582">202-681-7582</a> or <a href="mailto:press@demandprogress.org">press@demandprogress.org</a>
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
        <span>Built by:</span> <img src="/images/v2/credit-fftf.png" srcset="/images/v2/credit-fftf-x2.png 2x" />
      </div>
    </div>
  </footer>
</template>