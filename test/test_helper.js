(function testHelper() { 'use strict'

process.env['NODE_ENV'] = 'test'

const nock = require('nock')

global.config = {
  api: {
    server: (
      process.env.EXPERT_SENDER_API_SERVER ||
      'https://api3.esv2.com/'
    ),
    key: (
      process.env.EXPERT_SENDER_API_KEY ||
      'xxxxxxx'
    )
  }
}

global.itPerformsAPICall = function(mocksFactory, subject) {
  const scope = nock(config.api.server)
  const mocks = mocksFactory(scope)
  const interceptor = (mocks.interceptors && mocks.interceptors[0]) || mocks
  const hasMoreInterceptors = (mocks.interceptors && mocks.interceptors.length > 1)

  const testSubject =
    `performs ${interceptor.method} ${interceptor.path} ${hasMoreInterceptors ? '+' : ''}`

  it(testSubject, function (done) {
    assertRequests(() => mocks, subject, done)
  })
}

global.assertRequests = function(mocksFactory, action, callback) {
  const scope = nock(config.api.server)

  const mocks = mocksFactory(scope)
  const pending = ((scope) => JSON.stringify(scope.pendingMocks(), null, 2))

  const exit = (err, result) => { setImmediate(() => {
    nock.disableNetConnect()
    callback(err, result)
  }) }

  if (process.env.PERFORM_REQUESTS) {
    nock.cleanAll()
    nock.enableNetConnect()
  }

  action((err, result) => {
    if (err) { exit(err) }
    if (!mocks.isDone()) { return exit(new Error(`pending mocks:\n${pending(mocks)}`)) }

    exit(null, result)
  })
}
})()
