const assert = require('assert')
const reporter = require('../core/reporter')

const info = { info: 'info' }
const error = { error: 'error' }
const heading = { heading: 'heading' }
const warning = { warning: 'warning' }
const fake = { fake: 'fake' }
const table = {
  table: {
    heading: ['h1', 'h2', 'h3'],
    data: ['d1', 'd2', 'd3']
  }
}

describe('reporter', function() {
  it('should return empty array if no messages are reported', () => {
    assert.equal(reporter().length, 0)
  })
  it('should return empty array if no reportable messages are reported', () => {
    assert.equal(reporter([fake]).length, 0)
  })
  it('should return array of correct length after reporting valid messages', () => {
    assert.equal(reporter([info, error]).length, 2)
  })
  it('should return array of correct length after reporting valid messages and ignoring non reportable messages', () => {
    assert.equal(reporter([info, fake, error]).length, 2)
  })
  it('should return array reporting what types of message were reported', () => {
    assert.ok(reporter([info, error]).includes('info'))
    assert.ok(reporter([info, error]).includes('error'))
  })
  it('should report for each reportable message type', () => {
    assert.ok(reporter([info]).includes('info'), 'info')
    assert.ok(reporter([error]).includes('error'), 'error')
    assert.ok(reporter([heading]).includes('heading'), 'heading')
    assert.ok(reporter([warning]).includes('warning'), 'warning')
    assert.ok(reporter([table]).includes('table'), 'table')
  })
})
