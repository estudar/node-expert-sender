'use strict'

const xpath = require('xpath')
const dom = require('xmldom').DOMParser

const ERROR_MESSAGES_XPATH = '/ApiResponse/ErrorMessage/Messages/Message'

class ExpertSenderAPIError extends Error {
  constructor(message) {
    super(message)

    this.message = message
    this.name = 'ExpertSenderAPIError'
  }
}

function buildFromIncomingMessage(message, response) {
  if (message.statusCode >= 400) {
    const error =
      new ExpertSenderAPIError(`Unexpected status code "${message.statusCode}"\n${response}`)

    error.statusCode = message.statusCode
    error.response = response
    error.messages = extractErrorMessages(response)

    return error
  }
}

function extractErrorMessages(response) {
  if ((!response) || (String(response).length === 0)) { return [] }

  try {
    const doc = new dom().parseFromString(response)
    const result =
      xpath.evaluate(ERROR_MESSAGES_XPATH, doc, null, xpath.XPathResult.ANY_TYPE, null)

    return result.nodes.map(node => {
      let message = ""

      const errorForRow = node.getAttribute('for')
      if (errorForRow) { message = `${errorForRow}: ` }

      message = `${message}${node.textContent}`

      return message
    })
  } catch(e) {
    return [ `error while parsing response: ${e}` ]
  }
}

ExpertSenderAPIError.buildFromIncomingMessage = buildFromIncomingMessage

module.exports = ExpertSenderAPIError
