import Vue from 'vue'
import config from '~/config.json'

const AnalyticsPlugin = {
  install(Vue, options) {
    // add event tracking convenience method
    Vue.prototype.$trackEvent = function(category, action, label=null) {
      if (window.ga) {
        ga('send', 'event', category, action, label)
      }

      if (window._paq) {
        _paq.push(['trackEvent', category, action, label])
      }
    }

    // add click tracking convenience method
    Vue.prototype.$trackClick = function(category, label=null) {
      this.$trackEvent(category, 'click', label)
    }
  }
}

Vue.use(AnalyticsPlugin)

export default ({ app, store }) => {
  // disable analytics in dev
  if (process.env.NODE_ENV !== 'production') return

  // disable analytics if doNotTrack is set
  if (navigator && navigator.doNotTrack) return

  if (config.googleAnalyticsId) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', config.googleAnalyticsId, 'auto')
  }

  if (config.matomoSiteId) {
    window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    // _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
      var u="//analytics.fftf.cat/";
      _paq.push(['setTrackerUrl', u+'piwik.php']);
      _paq.push(['setSiteId', config.matomoSiteId]);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    })();
  }

  app.router.afterEach((to, from) => {
    if (window.ga) {
      ga('set', 'page', to.fullPath)
      ga('send', 'pageview')
    }

    if (window._paq) {
      _paq.push(['setDocumentTitle', to.fullPath])
      _paq.push(['trackPageView'])
    }
  })
}
