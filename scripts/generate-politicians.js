const axios = require('axios')
const fs = require('fs')
const path = require('path')

// ORDER BY yesOnCRA ASC, partyCode ASC, name ASC
function sortPoliticans(a, b) {
  if (a.yesOnCRA === b.yesOnCRA) {
    if (a.partyCode === b.partyCode) {
      if (a.name < b.name) {
        return -1
      }
      else if (a.name > b.name) {
        return 1
      }
      else {
        return 0
      }
    }
    else if (a.partyCode < b.partyCode) {
      return -1
    }
    else {
      return 1
    }
  }
  else if (a.yesOnCRA) {
    return 1
  }
  else {
    return -1
  }
}

async function main() {
  const response = await axios.get('https://data.battleforthenet.com/politicians.json')
  const politicians = response.data
  politicians.sort(sortPoliticans)

  fs.writeFileSync(path.resolve(__dirname, '../assets/data/politicians.json'), JSON.stringify(politicians, null, 2))
}

main().catch(console.error)