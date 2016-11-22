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

const assets = require(__dirname + `/assets/tweets/${selectedFilename}.json`)

const tweetIds = Object.keys(assets)

console.log('use: ' + selectedFilename)

function getNext (expectedScore = 'undefined') {
  let index = 0
  let item
  let sentimentObject
  let tweetId
  while (tweetId = tweetIds.pop()) {
    assets[tweetId].payload = assets[tweetId].payload
      .replace(/\s+/ig, ' ')
      .replace(/&amp;/ig, '&')
      .replace(/&gt;/ig, '>')
      .replace(/&lt;/ig, '<')
    sentimentObject = sentiment(assets[tweetId].payload, list)
    if (assets[tweetId].score === expectedScore) {
      return {
        id: tweetId,
        sentimentObject
      }
    }
    index++
  }
  return null
}

const item = getNext('undefined')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.question(item.sentimentObject.debugMessage, (answer) => {
  if (answer.match(/s/i)) {
    assets[item.id].score = 'skipped'
  } else if (answer.match(/x/i)) {
    delete assets[item.id]
  } else {
    assets[item.id].score = answer || item.sentimentObject.score
  }

  fs.writeFileSync(__dirname + `/assets/tweets/${selectedFilename}.json`, JSON.stringify(assets, null, 2))
  process.exit(0)
})
