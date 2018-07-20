const fs = require('fs')
const path = require('path')

function getAssets(dir) {
  if (file.match(/\.(png|jpg|jpeg|gif)$/i)) {
    assets.push(`/social-media/${file}`)
  }
}

async function main() {
  const dir = path.resolve(__dirname, '..', 'static', 'media')
  const assets = {}

  for (let subdir of fs.readdirSync(dir)) {
    const subdirPath = path.resolve(dir, subdir)

    if (fs.lstatSync(subdirPath).isDirectory()) {
      assets[subdir] = []

      for (let file of fs.readdirSync(subdirPath)) {
        if (file.match(/\.(png|jpg|jpeg|gif)$/i)) {
          assets[subdir].push(`/media/${subdir}/${file}`)
        }
      }
    }
  }

  const dataFile = path.resolve(__dirname, '..', 'assets', 'data', 'media.json')
  fs.writeFileSync(dataFile, JSON.stringify(assets, null, 2))
}

main().catch(console.error)
