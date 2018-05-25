import Vue from 'vue'
import { stringify } from 'querystring'
import Experiment from '~/components/Experiment'
import Variant from '~/components/Variant'
import settings from '~/config.json'

const getExperimentsString = (query={}) => {
  const data = Object.assign({}, localStorage, query)
  const experiments = {}

  for (let key of Object.keys(data)) {
    if (key.match(/^exp\./)) {
      experiments[key.replace(/^exp\./, '')] = data[key]
    }
  }

  return stringify(experiments)
}

const MyPlugin = {
  install(Vue, options) {
    // make <experiment> and <variant> global components
    const components = {
      Experiment,
      Variant
    }

    Object.keys(components).forEach(key => {
      Vue.component(key, components[key])
    })

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

Vue.use(MyPlugin)

export default ({ app }) => {
  // if (process.env.NODE_ENV !== 'production') return

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', settings.googleAnalyticsId, 'auto')

  window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  // _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//analytics.fftf.cat/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();

  app.router.afterEach((to, from) => {
    ga('set', 'page', to.fullPath)
    ga('set', 'dimension0', getExperimentsString(to.query))
    ga('send', 'pageview')

    _paq.push(['setDocumentTitle', to.fullPath]);
    _paq.push(['trackPageView']);
  })
}
