import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import settings from '~/config'

Raven
  .config(settings.sentryDSN)
  .addPlugin(RavenVue, Vue)
  .install()
