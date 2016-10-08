const assert = require('assert')
const parser = require('../core/parser')

const program = `
  const a = 1;
  const b = 2;
  const c = [1, 2, 3];
  if (a < b) {
    a += 1;
    c.push(b === 2 ? a : b);
  }
  for (const i = 0; i < c.length; i += 1) {
    console.log(i);
  }
`

describe('parser', function() {
  it('should return object with error property when not applied to an argument', () => {
    assert.ok(parser().error)
  })
  it('should not return object with error property when applied to a valid argument', () => {
    assert.ok(!parser(program).error)
  })
  it('should return object with loc, chars, conditionals and loops properties ', () => {
    assert.ok(parser(program).loc)
    assert.ok(parser(program).chars)
    assert.ok(parser(program).conditionals)
    assert.ok(parser(program).loops)
  })
  it('should return correct values for loc, chars, conditionals and loops properties ', () => {
    assert.equal(parser(program).loc, 11)
    assert.equal(parser(program).chars, 111)
    assert.equal(parser(program).conditionals, 2)
    assert.equal(parser(program).loops, 1)
  })
})
