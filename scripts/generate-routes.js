const axios = require('axios')
const fs = require('fs')
const path = require('path')

async function main() {
  const routes = []
  const { data } = await axios.get('https://data.battleforthenet.com/scoreboard/all.json')

  for (let pol of data) {
    routes.push(`/scoreboard/${pol.bioguide_id}`)
  }

  fs.writeFileSync(path.resolve(__dirname, '..', 'assets', 'data', 'routes.json'), JSON.stringify(routes, null, 2))
}

main().catch(console.error)
