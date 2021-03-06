const axios = require('axios')
const fs = require('fs')
const path = require('path')

async function fetchScoreboardData() {
  const { data } = await axios.get('https://data.battleforthenet.com/scoreboard/all.json')
  return data
}

async function fetchCaliforniaScoreboardData() {
  const { data } = await axios.get('https://data.battleforthenet.com/scoreboard/california.json')
  return data
}

async function main() {
  const routes = []
  const usPoliticians = await fetchScoreboardData()
  const caPoliticians = await fetchCaliforniaScoreboardData()
  const data = usPoliticians.concat(caPoliticians)

  for (let pol of data) {
    routes.push(`/scoreboard/${pol.bioguide_id}`)
  }

  fs.writeFileSync(path.resolve(__dirname, '..', 'assets', 'data', 'routes.json'), JSON.stringify(routes, null, 2))
}

main().catch(console.error)
