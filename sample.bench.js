// Sample .bench.js file for the fizz_buzz challenge.
// fizz_buzz.bench.js should be placed in the fizz_buzz directory
// The function it exports applies an argument (100) to the functions that are exported in the solutions
// For most challenges only the testName and the argument will need to be changed.

const testName = 'fizz_buzz'

const makeTest = fn => {
  fn(100)
}

module.exports = {
  name: testName,
  testFactory: makeTest
}
