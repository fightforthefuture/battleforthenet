const fs = require('fs')
const path = require('path')

async function main() {
  const dir = path.resolve(__dirname, '..', 'static', 'social-media')
  const files = fs.readdirSync(dir)
  const assets = []

  for (let file of files) {
    if (file.match(/\.(png|jpg|jpeg|gif)$/i)) {
      assets.push(`/social-media/${file}`)
    }
  }

  const dataFile = path.resolve(__dirname, '..', 'assets', 'data', 'social-media-assets.json')
  fs.writeFileSync(dataFile, JSON.stringify(assets, null, 2))
}

main().catch(console.error)
