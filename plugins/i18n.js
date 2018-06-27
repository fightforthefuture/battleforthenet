import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store, isDev }) => {
  let messages

  // use YAML strings files in dev for live updates
  if (isDev) {
    const formatStrings = require('~/assets/js/format-strings')

    // TODO: make these load automatically via directory structure
    messages = formatStrings({
      en: {
        pages: {
          index: require('~/locales/en/pages/index.yml'),
          redalert: require('~/locales/en/pages/redalert.yml'),
          call: {
            california: require('~/locales/en/pages/call/california.yml')
          },
          map: require('~/locales/en/pages/map.yml'),
          scoreboard: {
            index: require('~/locales/en/pages/scoreboard/index.yml'),
            all: require('~/locales/en/pages/scoreboard/all.yml'),
            id: require('~/locales/en/pages/scoreboard/id.yml'),
            social: require('~/locales/en/pages/scoreboard/social.yml')
          }
        },
        components: {
          BattleStats: require('~/locales/en/components/BattleStats.yml'),
          WantedPoster: require('~/locales/en/components/WantedPoster.yml'),
          CreateEvent: require('~/locales/en/components/CreateEvent.yml'),
          ScoreboardForm: require('~/locales/en/components/ScoreboardForm.yml')
        },
        social: require('~/locales/en/social.yml')
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
