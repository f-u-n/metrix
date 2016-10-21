const assert = require('assert')
const benchRunner = require('../core/benchRunner')
const benchmark = '../test/fixtures/test.bench.js'

describe('benchRunner', function() {
  it('should return object with error property when not applied to an argument', (done) => {
    benchRunner().then().catch(err => {
      assert.ok(err)
      done()
    })
  })
  it('should return array of all results', (done) => {
    benchRunner(benchmark).then(result => {
      assert.equal(result.length, 2)
      done()
    }).catch()
  })
  it('should return results containing correct tests', (done) => {
    benchRunner(benchmark).then(result => {
      assert.equal(result[0].name, 'a1.concat(a2)')
      assert.equal(result[1].name, '[...a1, ...a2]')
      done()
    }).catch()
  })
})

