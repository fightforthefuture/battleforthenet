import Vue from 'vue'
import config from '~/config.json'

const AnalyticsPlugin = {
  install(Vue, options) {
    // add event tracking convenience method
    Vue.prototype.$trackEvent = function (category, action, label = null) {
      if (window.ga) {
        ga('send', 'event', category, action, label)
      }

      if (window._paq) {
        _paq.push(['trackEvent', category, action, label])
      }
    }

    Vue.prototype.$trackGoal = function(goal, valueInCents = 0) {
      if (window.fathom && config.fathomGoals[goal]) {
        fathom.trackGoal(config.fathomGoals[goal], valueInCents)
      }
    }

    // add click tracking convenience method
    Vue.prototype.$trackClick = function (category, label = null) {
      this.$trackEvent(category, 'click', label)
    }
  }
}

Vue.use(AnalyticsPlugin)

export default ({ app, store }) => {
  // disable analytics in dev
  if (process.env.NODE_ENV !== 'production') return

  if (config.googleAnalyticsId) {
    // disable analytics if doNotTrack is set
    if (navigator && navigator.doNotTrack) return

    /* eslint-disable */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', config.googleAnalyticsId, 'auto')
    /* eslint-enable */
  }

  if (config.matomoSiteId) {
    /* eslint-disable */
    window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
      var u="https://fftf.matomo.cloud/";
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', config.matomoSiteId]);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
    })();
    /* eslint-enable */
  }

  if (config.fathomSiteId) {
    (function() {
      const script = document.createElement('script')
      script.src = 'https://hedgehog.fightforthefuture.org/script.js'
      script.defer = true
      script.setAttribute('site', config.fathomSiteId)
      script.setAttribute('spa', 'auto')
      document.body.appendChild(script)
    })()
  }

  app.router.afterEach((to, from) => {
    /* eslint-disable no-undef */
    if (window.ga) {
      ga('set', 'page', to.fullPath)
      ga('send', 'pageview')
    }

    if (window._paq) {
      _paq.push(['setDocumentTitle', to.fullPath])
      _paq.push(['trackPageView'])
    }

    if (window.fathom) {
      fathom.trackPageview()
    }
    /* eslint-enable no-undef */
  })
}
