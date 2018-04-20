const axios = require('axios')
const fs = require('fs')
const path = require('path')

async function main() {
  const { data } = await axios.get('https://data.battleforthenet.com/politicians.json')
  fs.writeFileSync(path.resolve(__dirname, '../assets/data/politicians.json'), JSON.stringify(data, null, 2))
}

main().catch(console.error)
