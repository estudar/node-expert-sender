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

global.itPerformsAPICall = function(mockFactory, subject) {
  const scope = nock(config.api.server)

  let mocks = mockFactory(scope)
  let pending = ((scope) => JSON.stringify(scope.pendingMocks(), null, 2))
  let interceptor = (mocks.interceptors && mocks.interceptors[0]) || mock
  let hasMoreInterceptors = (mocks.interceptors && mocks.interceptors.length > 1)

  let testSubject =
    `performs ${interceptor.method} ${interceptor.path} ${hasMoreInterceptors ? '+' : ''}`

  it(testSubject, function (done) {
    if (process.env.PERFORM_REQUESTS) {
      nock.cleanAll()
      nock.enableNetConnect()
    }

    subject.call(this, (err, res) => {
      if (err) { return done(err) }

      if (!mocks.isDone()) {
        return done(new Error(`pending mocks:\n${pending(mocks)}`))
      }

      done()
    })
  })
}
})()
