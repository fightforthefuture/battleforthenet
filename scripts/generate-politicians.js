const axios = require('axios')
const fs = require('fs')
const path = require('path')

async function main() {
  const { data } = await axios.get('https://data.battleforthenet.com/politicians.json')
  const politicians = data.filter(p => p.biocode !== 'M000303')
  fs.writeFileSync(path.resolve(__dirname, '../assets/data/politicians.json'), JSON.stringify(politicians, null, 2))
}

main().catch(console.error)
