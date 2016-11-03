const Benchmark = require('benchmark')
const isBench = /\.bench\.js$/
const isJs = /\.js$/
const { getDirectories, getFiles, getPath } = require('./lib/fsUtils')

const buildTests = path => {
  const benchFile = getFiles(path).filter(file => isBench.test(file))[0]
  if (!benchFile) {
    return {
      error: `benchmarkRunner could not find a .bench.js file in ${path}`
    }
  }
  const { name, testFactory } = require(getPath([path, benchFile]))
  const tests = {}
  getDirectories(path).forEach(solution => {
    if (solution !== 'test') {
      const files = getFiles(getPath([path, solution])).filter(file => isJs.test(file))
      if (files.length === 1) {
        tests[solution] = () => {
          const fn = require(getPath([path, solution, files[0]]))
          testFactory(fn)
        }
      }
    }
  })
  return {
    name,
    tests
  }
}

module.exports = path => {
  return new Promise(
    (resolve, reject) => {
      const testSuite = buildTests(path)
      if (testSuite.error) {
        reject(testSuite)
      }
      const results = []
      const suite = new Benchmark.Suite(testSuite.name)
      Object.keys(testSuite.tests).forEach(key => {
        suite.add(key, testSuite.tests[key], {
          onComplete: result => {
            const formatOrWarn = hz => {
              if (!hz) {
                return 'Code does not run. Check the file has a modules.export statement'
              }
              return Benchmark.formatNumber(hz.toFixed(0))
            }
            results.push({
              'name': result.target.name,
              'hz': formatOrWarn(result.target.hz)
            })
          }
        })
      })
      suite.on('complete', () => resolve(results)).run()
    }
  )
}

