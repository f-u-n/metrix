const assert = require('assert')
const benchRunner = require('../core/benchRunner')
const benchmark = __dirname + '/fixtures/'

describe('benchRunner', function() {
  it('should return object with error property when not applied to an argument', (done) => {
    benchRunner().then().catch(err => {
      assert.ok(err)
      done()
    })
  })
  it('should return array of all results', (done) => {
    benchRunner(benchmark).then(result => {
      assert.equal(result.length, 3)
      done()
    }).catch()
  })
  it('should return results containing all tests', (done) => {
    benchRunner(benchmark).then(result => {
      assert.equal(result[0].name, 'concat')
      assert.equal(result[1].name, 'fake')
      assert.equal(result[2].name, 'spread')
      done()
    }).catch()
  })
  it('should return warning results for tests that do not run', (done) => {
    benchRunner(benchmark).then(result => {
      assert.equal(result[1].hz, 'Code does not run. Check the file has a modules.export statement')
      done()
    }).catch()
  })
})

