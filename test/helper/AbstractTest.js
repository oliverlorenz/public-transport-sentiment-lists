/* global describe, it, assert */

'use strict'
const assert = require('assert')

module.exports = (() => {
  function weightTest (asset, list) {
    const description = `check "${asset}" with "${list}"-list`
    describe(description, () => {
      const assets = require(`../assets/${asset}`)
      const sentiment = require('../../../sentiment-custom-lists/lib')
      var counter = 0
      Object.keys(assets).forEach((key, item) => {
        const assetItem = assets[key]
        assetItem.payload = assetItem.payload
          .replace(/\s+/ig, ' ')
          .replace(/&amp;/ig, '&')
          .replace(/&gt;/ig, '>')
          .replace(/&lt;/ig, '<')

        const result = sentiment(assetItem.payload, list)
        const pattern = /^([<>=!]+)([0-9-]+)$/g

        if (assetItem.score === 'undefined') {
          describe(result.debugMessage + ` (undefined)`.grey, () => {
            it.skip('this is a automatic added tweet. please add a score to unskip this test', () => {

            })
          })
          return
        } else {
          let [matches, operator, score] = pattern.exec(assetItem.score)
          describe(result.debugMessage + ` (${operator}${score})`.grey, () => {
            switch (operator) {
              case '<':
                it(`score should be smaller than "${score}"`, () => {
                  try {
                    assert.ok(result.score < score, result)
                  } catch (err) {
                    throw err
                  }
                })
                break
              case '<=':
                it(`score should be smaller or the same as "${score}"`, () => {
                  try {
                    assert.ok(result.score <= score, result)
                  } catch (err) {
                    throw err
                  }
                })
                break
              case '=':
              case '==':
              case '===':
                it(`score should be equal "${score}"`, () => {
                  try {
                    assert.equal(result.score, parseInt(score, 10), result)
                  } catch (err) {
                    throw err
                  }
                })
                break
              case '>':
                it(`score should be greater than "${score}"`, () => {
                  try {
                    assert.ok(result.score > score, result)
                  } catch (err) {
                    throw err
                  }
                })
                break
              case '>=':
                it(`score should be greater or the same as "${score}"`, () => {
                  try {
                    assert.ok(result.score >= score, result)
                  } catch (err) {
                    throw err
                  }
                })
                break
              case '!':
                it(`score should be not the same as "${score}"`, () => {
                  try {
                    assert.ok(result.score !== score, result)
                  } catch (err) {
                    throw err
                  }
                })
                break
            }
          })
        }
      })
    })
  }

  return {
    weightTest
  }
})()
