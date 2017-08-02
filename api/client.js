'use strict'

const assert = require('assert')
const https = require('https')
const url = require('url')
const debug = require('debug')('expertsender')

const AddSubscriberRequest = require('./requests/add_subscriber')
const DataTablesAddRowRequest = require('./requests/data_tables/add_row')

const DEFAULT_TIMEOUT = 1000

module.exports = class ExpertSenderAPIClient {
  constructor(server, key, options = {}) {
    this.apiServer = server
    this.apiKey = key

    this.timeout = options.timeout
    this.defaultRequestOptions = {
      timeout: this.timeout
    }
  }

  addSubscriber(listId, subscriber) {
    assert(listId, "You must specify a ListId")
    assert(subscriber, "You must specify a subscriber")

    let request =
      new AddSubscriberRequest(this.apiKey, listId, subscriber)

    return this._perform(request, this.defaultRequestOptions)
  }

  dataTablesAddRow(tableName, row) {
    assert(tableName, "You must specify a table")

    let request =
      new DataTablesAddRowRequest(this.apiKey, tableName, row)

    return this._perform(request, this.defaultRequestOptions)
  }

  _perform(request, opts = {}) {
    const payload = request.buildXML()

    const options = Object.assign(url.parse(this.apiServer), {
      method: request.method,
      path: request.path,
      headers: {
        'Content-Type': 'text/xml',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: this.timeout
    }, opts)

    return new Promise((resolve, reject) => {
      let req = https.request(options)
      .on('response', (message) => {
        const body = []

        message
        .on('aborted', reject)
        .on('data', (data) => body.push(data))
        .on('end', () => {
          if (message.statusCode < 400) {
            if (!message['content-length']) { return resolve(null) }
            else { return resolve(body) }
          } else {
            reject(new Error(
              `Unexpected status code "${message.statusCode}"\n${
                Buffer.concat(body).toString()}`
            ))
          }
        })
      })
      .on('error', reject)

      debug(`sending request\n${request.method} ${request.path}\n${payload}`)

      req.write(payload)
      req.end()
    })
  }

}
