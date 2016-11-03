var a1 = [1, 2, 3]
var a2 = [4, 5, 6]

const makeTest = fn => {
  fn(a1, a2)
}

module.exports = {
  name: 'Benchmark test',
  testFactory: makeTest
}

