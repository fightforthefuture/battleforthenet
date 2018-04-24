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

  app.router.afterEach((to, from) => {
    ga('set', 'page', to.fullPath)
    ga('set', 'dimension0', getExperimentsString(to.query))
    ga('send', 'pageview')
  })
}