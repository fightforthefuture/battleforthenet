#!/usr/bin/env node

/*
  This script assumes imagemagick is installed and in your path
*/

const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

const srcDir = path.resolve(__dirname, '..', 'images', 'logos') // change to original-logos if you want to start over
const dstDir = path.resolve(__dirname, '..', 'images', 'logos')
const logos = fs.readdirSync(srcDir).filter(l => l.match(/\.(png|jpg|jpeg|gif)$/i)).sort()

const MAX_HEIGHT = 200.0
const MAX_DPI = 72.0

for (let logo of logos) {
  exec(`identify -format "%w,%h,%x" "${path.resolve(srcDir, logo)}"`, (err, stdout, stderr) => {
    if (err || stderr) {
      return console.error(`😿 ${err || stderr}`)
    }

    const [width, height, dpi] = stdout.split(',').map(f => parseFloat(f))

    if (height > MAX_HEIGHT || dpi > MAX_DPI) {
      let cmd = `convert -resize x${MAX_HEIGHT}\\>`

      if (logo.match(/\.(jpg|jpeg)$/)) {
        cmd += ' -quality 80'
      }

      if (dpi > MAX_DPI) {
        cmd += ` -density ${MAX_DPI}`
      }

      cmd += ` "${path.resolve(srcDir, logo)}" "${path.resolve(dstDir, logo)}"`

      console.log(cmd)

      exec(cmd, (err, stdout, stderr) => {
        if (err || stderr) {
          return console.error(`😿 ${err || stderr}`)
        }
      })
    }
  })
}
