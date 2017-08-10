'use strict'

const assert = require('assert')
const https = require('https')
const url = require('url')
const debug = require('debug')('expertsender')

const AddSubscriberRequest = require('./requests/add_subscriber')
const DataTablesAddRowRequest = require('./requests/data_tables/add_row')
const DataTablesAddMultipleRowsRequest = require('./requests/data_tables/add_multiple_rows')
const DataTablesUpdateRowRequest = require('./requests/data_tables/update_row')

const ExpertSenderAPIError = require('./error')

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

  dataTablesAddMultipleRows(tableName, rows) {
    assert(tableName, "You must specify a table")

    let request =
      new DataTablesAddMultipleRowsRequest(this.apiKey, tableName, rows)

    return this._perform(request, this.defaultRequestOptions)
  }

  dataTablesUpdateRow(tableName, primaryKeys, row) {
    assert(tableName, "You must specify a table")

    let request =
      new DataTablesUpdateRowRequest(this.apiKey, tableName, primaryKeys, row)

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
          const response = Buffer.concat(body).toString('utf8')
          const error = ExpertSenderAPIError.buildFromIncomingMessage(message, response)

          if (error) { reject(error) }
          else { resolve(response) }
        })
      })
      .on('error', reject)

      debug(`sending request\n${request.method} ${request.path}\n${payload}`)

      req.write(payload)
      req.end()
    })
  }

}
