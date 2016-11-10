'use strict'
const accounts = [
//  'hochbahn',
  'HVVStoerungen',
//  'SBahnHamburg'
]
const sentiment = require('sentiment-custom-lists')
const readline = require('readline')
const fs = require('fs')

const list = 'de_de-public-transport'
accounts.forEach((index) => {
  const assets = require(`./assets/tweets/${index}.json`)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  let assetItem
  let calclulatedScore
  Object.keys(assets).every((key, item) => {
    assetItem = Object.assign({}, assets[key])
    assetItem.id = key
    if (assetItem.score === 'undefined') {
      assetItem.payload = assetItem.payload
        .replace(/\s+/ig, ' ')
        .replace(/&amp;/ig, '&')
        .replace(/&gt;/ig, '>')
        .replace(/&lt;/ig, '<')
      assetItem.sentiment = sentiment(assetItem.payload, list)
      calclulatedScore = assetItem.sentiment.score
      return false
    }
    return true
  })
  rl.question(assetItem.sentiment.debugMessage, (answer) => {
    answer = answer || calclulatedScore
    if (answer === 'x') {
      delete assets[assetItem.id]
    } else {
      assets[assetItem.id].score = `=${answer}`
    }
    fs.writeFileSync(`./test/assets/tweets/${index}.json`, JSON.stringify(assets, null, 2))
    rl.close()
  })
})
