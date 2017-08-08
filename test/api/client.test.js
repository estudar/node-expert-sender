'use strict'

const APIClient = require('../../api/client')

describe('APIClient', function () {
  let client = new APIClient(config.api.server, config.api.key)

  describe('#addSubscriber(listId, subscriber)', function () {
    let subject =
      (listId, subscriber) => client.addSubscriber(listId, subscriber)

    let listId = 53
    let subscriber = [
      { email: 'd@ni.el', firstname: 'Daniel' },
      { email: 'sc@rle.tt', firstname: 'Scarlett' }
    ]

    itPerformsAPICall(
      (scope) => scope.post('/Api/Subscribers/').reply(201),
      function (done) {
        subject(listId, subscriber).then(done).catch(done)
      }
    )
  })

  describe('#dataTablesAddRow(tableName, row)', function () {
    let subject =
      (tableName, row) => client.dataTablesAddRow(tableName, row)

    let tableName = 'sandbox_users'
    let row = { name: "Daniel", email: "d@ni.el" }

    itPerformsAPICall(
      (scope) => scope.post('/Api/DataTablesAddRow/').reply(201),
      function (done) {
        subject(tableName, row).then(done).catch(done)
      }
    )
  })

  describe('#dataTablesUpdateRow(tableName, primaryKeys, row)', function () {
    let subject =
      (tableName, primaryKeys, row) => client.dataTablesUpdateRow(tableName, primaryKeys, row)

    let tableName = 'sandbox_users'
    let primaryKeys = { email: "d@ni.el" }
    let row = { name: "Daniel T" }

    itPerformsAPICall(
      (scope) => scope.post('/Api/DataTablesUpdateRow/').reply(204),
      function (done) {
        subject(tableName, primaryKeys, row).then(done).catch(done)
      }
    )
  })
})
