'use strict'

const old = require('old')
const Tendermint = require('tendermint')
const types = require('./types.js')

const QUERY_BY_INDEX = 0
const QUERY_BY_KEY = 1

class Client {
  constructor (node) {
    if (typeof node === 'string' || typeof node === 'undefined') {
      this.tendermint = Tendermint(node)
    } else {
      this.tendermint = node
    }
  }

  query (type, key, cb) {
    let query = types.query.encode({ type, key })
    this.tendermint.abciQuery({ query }, (err, res) => {
      if (err) return cb(err)
      if (res[1].result.Data === '') return cb(null, null)
      cb(null, Buffer.from(res[1].result.Data, 'hex'))
    })
  }

  get (key, cb) {
    return this.query(QUERY_BY_KEY, key, cb)
  }

  getIndex (index, cb) {
    let indexBuf = Buffer.alloc(4)
    indexBuf.writeUInt32BE(index, 0)
    return this.query(QUERY_BY_INDEX, indexBuf, cb)
  }

  // TODO: set, remove
}

module.exports = old(Client)
