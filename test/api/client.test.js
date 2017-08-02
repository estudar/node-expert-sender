'use strict'

const APIClient = require('../../api/client')

describe('APIClient', function () {
  let client = (...args) => new APIClient(...args)

  describe('#addSubscriber(listId, subscriber)', function () {
    let subject = (listId, subscriber) => {
      return client(config.api.server, config.api.key)
        .addSubscriber(listId, subscriber)
    }

    let subscriber = { email: 'd@ni.el', firstname: 'Daniel' }

    itPerformsAPICall(
      (scope) => scope.post('/Api/Subscribers/').reply(201),
      function (done) {
        subject(53, subscriber).then(done).catch(done)
      }
    )
  })
})
