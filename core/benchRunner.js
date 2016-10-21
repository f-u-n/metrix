const Benchmark = require('benchmark')
const isBench = /\.bench\.js$/

module.exports = file => {
  return new Promise(
    (resolve, reject) => {
      if (!file || !isBench.test(file)) {
        reject({
          error: 'benchmarkRunner did not receive a .bench.js file'
        })
      }
      const results = []
      const test = require(file)
      const suite = new Benchmark.Suite(test.name)
      Object.keys(test.tests).forEach(key => {
        suite.add(key, test.tests[key], {
          onComplete: result => {
            results.push({
              'name': result.target.name,
              'hz': Benchmark.formatNumber(result.target.hz.toFixed(0))
            })
          }
        })
      })
      suite.on('complete', () => resolve(results)).run()
    }
  )
}

