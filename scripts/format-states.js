const states = require('../assets/data/states.json')
const formattedStates = []
const fs = require('fs')
// const path = require('path')

Object.keys(states).forEach(code => {
  formattedStates.push({
    code: code,
    name: states[code]
  })
})

fs.writeFileSync('states.json', JSON.stringify(states, null, 2))