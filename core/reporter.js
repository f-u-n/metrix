const chalk = require('chalk')
const Table = require('cli-table')

const Reporter = function() {
  return this instanceof Reporter ? this : new Reporter()
}

const indent = content => `  ${content}`

Reporter.prototype.info = content => chalk.blue(indent(content))

Reporter.prototype.error = content => chalk.red(indent(content))

Reporter.prototype.heading = chalk.bold.underline.inverse

Reporter.prototype.warning = content => chalk.yellow(indent(content))

Reporter.prototype.table = function(content) {
  const heading = content.heading
  const data = content.data
  const numberOfColumns = Math.max(heading.length, data.length)
  const colWidth = Math.floor(100/numberOfColumns)
  let table = new Table({
    head: heading,
    colWidths: [].fill(colWidth, 0, numberOfColumns)
  })
  table.push(data)
  return table.toString()
}

module.exports = messages => {
  if (!messages) {
    return []
  }
  const reporter = Reporter()
  let messagesLogged = []
  messages.forEach(message => {
    for (const key in message) {
      if (typeof reporter[key] === 'function') {
        console.log(reporter[key](message[key]))
        messagesLogged.push(key)
      }
    }
  })
  return messagesLogged
}

