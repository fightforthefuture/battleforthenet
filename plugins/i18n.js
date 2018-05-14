import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store, isDev }) => {
  let messages

  // use YAML strings files in dev for live updates
  if (isDev) {
    const formatStrings = require('~/assets/js/format-strings')
    messages = formatStrings({
      en: {
        redalert: require('~/locales/en/redalert.yml'),
        components: {
          BattleStats: require('~/locales/en/components/BattleStats.yml')
        }
      }
    })
  }
  // use compiled JSON strings in production
  else {
    messages = require('~/assets/data/strings.json')
  }

  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: messages
  })
}
