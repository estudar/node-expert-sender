'use strict'

const Request = require('./request')
const xml = require('../xml')

/**
 * Add subscriber to a subscribe list.
 *
 * Read the docs for more info about the options.
 * https://sites.google.com/a/expertsender.com/api-documentation/methods/subscribers/add-subscriber
 */
class AddSubscriberRequest extends Request {
  get method() { return 'POST' }
  get path()   { return '/Api/Subscribers/' }

  constructor(apiKey, listId, subscriber, options = {}) {
    super(apiKey, options)

    this.listId = listId
    this.subscriber = subscriber

    this.options = Object.assign({
      mode: "AddAndUpdate",
      force: false,
      allowUnsubscribed: true,
      allowRemoved: true,
      matchingMode: undefined,
    }, this.options)
  }

  xmlData() {
    return xml.tag('Data', [
      xml.tag('Mode', this.options.mode),
      xml.tag('Force', this.options.force),
      xml.tag('AllowUnsubscribed', this.options.allowUnsubscribed),
      xml.tag('AllowRemoved', this.options.allowRemoved),
      (this.options.matchingMode === undefined ? // Use api default.
        '' :
        xml.tag('MatchingMode', this.options.matchingMode)
      ),
      xml.tag('ListId', this.listId),
      ...xml.objectToXMLTags(this.subscriber)
    ], {
      attributes: {'xsi:type': "Subscriber"}
    })
  }
}

module.exports = AddSubscriberRequest
