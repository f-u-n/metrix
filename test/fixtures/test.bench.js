var a1 = [1, 2, 3]
var a2 = [4, 5, 6]

module.exports = {
  name: 'Benchmark test',
  tests: {
    'a1.concat(a2)': function() {
      a1.concat(a2);
    },
    '[...a1, ...a2]': function() {
      [...a1, ...a2]
    }
  }
}

