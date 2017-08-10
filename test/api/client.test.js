'use strict'

const assert = require('assert')
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
    let row = { name: "Daniel", email: `d${+new Date()}@ni.el` }

    itPerformsAPICall(
      (scope) => scope.post('/Api/DataTablesAddRow/').reply(201),
      function (done) {
        subject(tableName, row).then(done).catch(done)
      }
    )
  })

  describe('#dataTablesAddMultipleRows(tableName, rows)', function () {
    let subject =
      (tableName, rows) => client.dataTablesAddMultipleRows(tableName, rows)

    let tableName = 'sandbox_users'
    let rows = [
      { name: "Daniel", email: `d${+new Date()}@ni.el` },
      { name: "Danilo", email: `d${+new Date()}@ni.lo` }
    ]

    itPerformsAPICall(
      (scope) => scope.post('/Api/DataTablesAddMultipleRows/').reply(201),
      function (done) {
        subject(tableName, rows).then(done).catch(done)
      }
    )

    describe('when request fails', function () {
      it('fails with APIError object', function (done) {
        assertRequests(
          (scope) => { return scope
              .post('/Api/DataTablesAddMultipleRows/')
              .reply(400, '<ApiResponse xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><ErrorMessage><Code>400</Code><Messages><Message for="Row 1">Request does not contain required columns.</Message></Messages></ErrorMessage></ApiResponse>')
          },
          (callback) => { callback(null, subject(tableName, [{xxx: "X"}])) },
          (err, result) => {
            if (err) { return done(err) }

            result.catch(error => {
              assert.strictEqual('ExpertSenderAPIError', error.name)
              assert.ok(error.messages instanceof Array, 'expect error.messages to be an Array')
              assert.strictEqual('Row 1: Request does not contain required columns.', error.messages[0])
            }).then(done, done)
          }
        )
      })
    })
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
