import Vue from 'vue'
import VueI18n from 'vue-i18n'
import showdown from 'showdown'
import cloneDeep from 'lodash/cloneDeep'

const md = new showdown.Converter()

// apply markdown filter recursively as needed
function formatStrings(data, isMarkdown=false) {
  let parsedData = cloneDeep(data)

  if (Array.isArray(data)) {
    parsedData = data.map(formatStrings)
  }
  else if (typeof(data) === 'object') {
    for (let key of Object.keys(data)) {
      if (data[key]) {
        parsedData[key] = formatStrings(data[key], key.match(/_html$/))
      }
    }
  }
  else if (isMarkdown) {
    parsedData = md.makeHtml(data)
  }

  return parsedData
}

Vue.use(VueI18n)

export default ({ app, store }) => {
  const messages = formatStrings({
    en: {
      redalert: require('~/locales/en/redalert.yml')
    }
  })

  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: messages
  })
}
