const axios = require('axios')
const fs = require('fs')
const path = require('path')

const statsFile = path.resolve(__dirname, '../assets/data/battle-stats.json')

async function getBusinessCount() {
  const { data } = await axios.get('https://raw.githubusercontent.com/fightforthefuture/businessesfornetneutrality.com/master/config.json')
  return data.signatureCount
}

async function main() {
  const stats = {}
  stats.bizCount = await getBusinessCount()
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2))
}

main().catch(console.error)
