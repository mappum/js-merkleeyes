'use strict'

const old = require('old')
const Tendermint = require('tendermint')
const types = require('./types.js')

class Client {
  constructor (node) {
    if (typeof node === 'string' || typeof node === 'undefined') {
      this.tendermint = Tendermint(node)
    } else {
      this.tendermint = node
    }
  }

  query (key, cb) {
    let query = types.query.encode({ type: 1, key })
    this.tendermint.abciQuery({ query }, (err, res) => {
      if (err) return cb(err)
      let resJson = Buffer.from(res[1].result.Data, 'hex').toString()
      return JSON.parse(resJson)
    })
  }
}

module.exports = old(Client)
