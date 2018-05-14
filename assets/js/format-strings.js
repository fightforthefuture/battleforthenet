// apply markdown filter recursively as needed
function formatStrings(data, isMarkdown=false) {
  const showdown = require('showdown')
  const md = new showdown.Converter()
  const cloneDeep = require('lodash/cloneDeep')
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

module.exports = formatStrings
