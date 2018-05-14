const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const formatStrings = require('../assets/js/format-strings')

function loadStrings(filePath) {
  const stringsFile = path.resolve(__dirname, '..', 'locales', 'en', filePath)
  const strings = yaml.safeLoad(fs.readFileSync(stringsFile, 'utf8'))
  return formatStrings(strings)
}

const messages = formatStrings({
  en: {
    redalert: loadStrings('redalert.yml'),
    components: {
      BattleStats: loadStrings('components/BattleStats.yml')
    }
  }
})

const outputFile = path.resolve(__dirname, '..', 'assets', 'data', 'strings.json')
fs.writeFileSync(outputFile, JSON.stringify(messages, null, 2))
