'use strict'

const fs = require('fs')
const readline = require('readline')
const sentiment = require('sentiment-custom-lists')
let fallbackFile
const assetFiles = fs.readdirSync(__dirname + '/assets/tweets/').filter((filename) => {
  const matched = filename.match(/\.json$/)
  if (matched && fs.readFileSync(__dirname + '/assets/tweets/' + filename).indexOf('"undefined"') !== -1) {
    fallbackFile = filename.replace(/\.json$/, '')
  }
  return filename.match(/\.json$/)
})
if (assetFiles.indexOf(process.argv[2] + '.json') === -1) {
  process.argv[2] = fallbackFile
}

const selectedFilename = process.argv[2]
const list = process.argv[3] || 'de_de-public-transport'

const assets = require(__dirname + `/assets/tweets/HVVStoerungen.json`)

//console.log(Object.keys(assets))

let newList = {}

Object.keys(assets).forEach((key) => {
  const newObj = {
    score: assets[key].score,
    payload: assets[key].payload
      .replace(/\s+/ig, ' ')
      .replace(/&amp;/ig, '&')
      .replace(/&gt;/ig, '>')
      .replace(/&lt;/ig, '<')
  }
  newList[key.toString()] = newObj
})
fs.writeFileSync(__dirname + `/assets/tweets/HVVStoerungen.json`, JSON.stringify(newList, null, 2))
//console.log(newList)
/*
console.log(assets.map((key, value) => {
  console.log(key)
}))
*/
