'use strict'
const accounts = [
  'hochbahn',
  'HVVStoerungen',
  'SBahnHamburg'
]
const sentiment = require('sentiment-custom-lists')
const readline = require('readline')
const fs = require('fs')

const list = 'de_de-public-transport'

function getFirstUndefinedDatasetId (assets) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(assets)
    let id
    while (id = keys.pop()) {
      const assetItem = Object.assign({}, assets[id])
      assetItem.id = id
      if (assetItem.score === 'undefined') {
          assetItem.payload = assetItem.payload
          .replace(/\s+/ig, ' ')
          .replace(/&amp;/ig, '&')
          .replace(/&gt;/ig, '>')
          .replace(/&lt;/ig, '<')
        assetItem.sentiment = sentiment(assetItem.payload, list)
        resolve(assetItem)
      }
    }
  })
}

accounts.forEach((index) => {
  const assets = require(`./assets/tweets/${index}.json`)
  getFirstUndefinedDatasetId(assets)
  .then((assetItem) => {
    if (assetItem.sentiment) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.question(assetItem.sentiment.debugMessage, (answer) => {
        answer = answer || assetItem.sentiment.score
        if (answer === 'x') {
          delete assets[assetItem.id]
        } else if (answer === 's') {
          assets[assetItem.id].score = 'skipped'
        } else {
          assets[assetItem.id].score = `=${answer}`
          delete assets[assetItem.id].sentiment
        }
        fs.writeFileSync(`./test/assets/tweets/${index}.json`, JSON.stringify(assets, null, 2))
        rl.close()
        const spawn = require('child_process').spawn
        const ls = spawn('npm', ['test'])
        ls.stdout.pipe(process.stdout)
      })
    }
  })
})

/*
accounts.forEach((index) => {
  const assets = require(`./assets/tweets/${index}.json`)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  let assetItem
  let calclulatedScore
  const keys = Object.keys(assets)
  let key
  while (key = keys.pop()) {
    assetItem = Object.assign({}, assets[key])
    console.log(key, assetItem.score)
    assetItem.id = key
    if (assetItem.score === 'undefined') {
      assetItem.payload = assetItem.payload
        .replace(/\s+/ig, ' ')
        .replace(/&amp;/ig, '&')
        .replace(/&gt;/ig, '>')
        .replace(/&lt;/ig, '<')
      assetItem.sentiment = sentiment(assetItem.payload, list)
      calclulatedScore = assetItem.sentiment.score
      break;
    }
  }

})
*/
