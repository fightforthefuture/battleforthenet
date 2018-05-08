const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const showdown = require('showdown')
const md = new showdown.Converter()

const stringsDir = path.resolve(__dirname, '../assets/strings')
const dataFile = path.resolve(__dirname, '../assets/data/strings.json')

const getAllFiles = dir =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);

function markdownify(data) {
  let parsedData = _.cloneDeep(data)

  if (Array.isArray(data)) {
    parsedData = data.map(markdownify)
  }
  else if (typeof(data) === 'object') {
    for (let key of Object.keys(data)) {
      if (data[key]) {
        parsedData[key] = markdownify(data[key])
      }
    }
  }
  else if (_.isString(data)) {
    if (data.split('\n').length === 1) {
      parsedData = md.makeHtml(data).replace(/^\<p\>/, '').replace(/\<\/p\>$/, '')
    }
    else {
      parsedData = md.makeHtml(data)
    }
  }

  return parsedData
}

const files = getAllFiles(stringsDir).filter(f => f.match(/\.(yml|json)$/))
let strings = {}

for (let file of files) {
  // console.log(file)
  // const objPath = file.replace(stringsDir, '').replace(/^\//, '').replace(/\.(yml|json)$/, '')
  // console.log(objPath)
  const data = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
  _.merge(strings, data)
}

strings = markdownify(strings)
fs.writeFileSync(dataFile, JSON.stringify(strings, null, 2))
