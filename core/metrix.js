/**
 * metrix.js
 * provides some metrics for js submission
 * usage: metrix.js <solution>
 *
 * @solution:  The full path to the playtime challenge
 *
 * Example: node metrix /home/username/dev/playtime/fizz_buzz/
 * 
 */


const challengeDir = process.argv[2]
const fs = require('fs')
const path = require('path')
const parser = require('./parser')
const reporter = require('./reporter')
const benchRunner = require('./benchRunner')

const getDirectories = srcPath => {
  return fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory())
}

const getFiles = srcPath => {
  return fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isFile())
}

const parseSolutions = challengeDir => {
  const solutions = getDirectories(challengeDir)
  return results = solutions.map((solutionDir) => {
    const files = getFiles(`${challengeDir}/${solutionDir}/`).filter(file => /.js$/.test(file))
    if (files.length !== 1) {
      return { error: `expected 1 .js file in ${solutionDir} but found ${files.length}` }
    }
    return Object.assign({ name: solutionDir }, parser(fs.readFileSync(path.join(challengeDir, solutionDir, files[0]), 'utf8')))
  })
}

const benchmarkSolutions = challengeDir => {
  const files = getFiles(challengeDir).filter(file => /.bench.js$/.test(file))
  if (files.length !== 1) {
    return { error: `expected 1 .bench.js file in ${challengeDir} but found ${files.length}` }
  }
  const benchmarkFile = challengeDir.concat(files[0])
  return {
    benchmarkFile,
    results: benchRunner(benchmarkFile)
  }
}

let shouldRun = true
let errors = []

if (!challengeDir) {
  errors.push({ error: 'missing required argument' })
  shouldRun = false
}

if (!fs.statSync(challengeDir).isDirectory()) {
  errors.push({ error: `${challengeDir} is not a directory` })
  shouldRun = false
}

if (shouldRun) {
  reporter([{ heading: `Running metrix against ${challengeDir}` }])
  reporter([{ info: 'Analyzing solutions' }])
  const parsedSolutions = parseSolutions(challengeDir)
  if (parseSolutions.error != null) {
    reporter([parseSolutions])
  } else {
    const results = parsedSolutions.filter(result => result.error == null).map(result => {
      return { table: {
        heading: ['Solution', 'Lines', 'Chars', 'Conditionals', 'Loops'],
        data: [ result.name, result.loc, result.chars, result.conditionals, result.loops] } }
    })
    const errors = parsedSolutions.filter(result => result.error != null)
    reporter(results.concat(errors))
  }
  reporter([{ info: 'Benchmarking solutions' }])
  const benchmarkedSolutions = benchmarkSolutions(challengeDir)
  if (benchmarkedSolutions.error != null) {
    reporter([benchmarkedSolutions])
  } else {
    reporter([{ info: `Benchmark file: ${benchmarkedSolutions.benchmarkFile}` }])
    benchmarkedSolutions.results.then(result => result).then(results => {
      reporter(results.map(result => {
        return { table: {
            heading: ['Solution', 'Hz'],
            data: [result.name, result.hz]
          }
        }
      }))
    }).catch(err => err)
  }
} else {
  reporter(errors)
}

