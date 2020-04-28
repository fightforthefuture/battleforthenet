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
    pages: {
      index: loadStrings('pages/index.yml'),
      privacy: loadStrings('pages/privacy.yml'),
      redalert: loadStrings('pages/redalert.yml'),
      augustrecess: loadStrings('pages/augustrecess.yml'),
      california: loadStrings('pages/california.yml'),
      call: {
        california: loadStrings('pages/call/california.yml')
      },
      public_safety: loadStrings('pages/public_safety.yml'),
      map: loadStrings('pages/map.yml'),
      maryland: loadStrings('pages/maryland.yml'),
      newyork: loadStrings('pages/newyork.yml'),
      scoreboard: {
        index: loadStrings('pages/scoreboard/index.yml'),
        all: loadStrings('pages/scoreboard/all.yml'),
        id: loadStrings('pages/scoreboard/id.yml'),
        social: loadStrings('pages/scoreboard/social.yml')
      },
      media: loadStrings('pages/media.yml')
    },
    components: {
      BattleStats: loadStrings('components/BattleStats.yml'),
      WantedPoster: loadStrings('components/WantedPoster.yml'),
      CreateEvent: loadStrings('components/CreateEvent.yml'),
      ScoreboardForm: loadStrings('components/ScoreboardForm.yml'),
      RepInterstitial: loadStrings('components/RepInterstitial.yml'),
      ScoreboardLegend: loadStrings('components/ScoreboardLegend.yml'),
      Scoreboard: loadStrings('components/Scoreboard.yml'),
      CopyToClipboard: loadStrings('components/CopyToClipboard.yml'),
      WidgetInstructions: loadStrings('components/WidgetInstructions.yml')
    },
    social: loadStrings('social.yml')
  }
})

const outputFile = path.resolve(__dirname, '..', 'assets', 'data', 'strings.json')
fs.writeFileSync(outputFile, JSON.stringify(messages, null, 2))
