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
    const subscribers = [].concat(this.subscriber)

    const subscriberXML = (subscriber) => { return [
      xml.tag('Mode', this.options.mode),
      xml.tag('Force', this.options.force),
      xml.tag('AllowUnsubscribed', this.options.allowUnsubscribed),
      xml.tag('AllowRemoved', this.options.allowRemoved),
      xml.tag('MatchingMode', this.options.matchingMode, {
        if: this.options.matchingMode !== undefined // Use API default.
      }),
      xml.tag('ListId', this.listId),
      ...xml.mapObject(subscriber)
    ] }

    if (subscribers.length > 1) {
      return xml.tag('Data',
        subscriberXML(subscribers[0]),
        { attributes: {'xsi:type': "Subscriber"} }
      )
    } else {
      return xml.tag('MultiData',
        subscribers.map(sub => xml.tag('Subscriber', subscriberXML(sub)))
      )
    }
  }
}

module.exports = AddSubscriberRequest
