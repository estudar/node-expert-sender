'use strict'

const xml = require('../xml')

/**
 * Base class for ExpertSender API Requests.
 *
 * IMPORTANT: - Request body should be XML, UTF-8 encoded,
 *              without XML header (<?xml...).
 *            - Get an API key in "Service Settings > API".
 *            - Content-Type header should be always "text/xml".
 *            - The API responds with UTF8-BOM on some methods (e.g.
 *              /Api/DataTablesGetData/).
 *            - Do not add/update more than 100 subscribers with a single API
 *              call.
 */
class Request {
  get method() { return 'GET' }
  get path()   { return '/' }

  constructor(apiKey, options = {}) {
    this.apiKey = apiKey

    this.options = Object.assign({
      returnData: false,
      verboseErrors: false,
    }, options)
  }

  xmlData() {
    return ""
  }

  buildXML() {
    return xml.tag('ApiRequest', [
      xml.tag('ApiKey', this.apiKey),
      (this.options.returnData ? xml.tag('ReturnData', "true") : ""),
      (this.options.verboseErrors ? xml.tag('VerboseErrors', "true") : ""),
      this.xmlData()
    ], {
      attributes: {
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xmlns:xs": "http://www.w3.org/2001/XMLSchema"
      }
    })
  }
}

module.exports = Request
