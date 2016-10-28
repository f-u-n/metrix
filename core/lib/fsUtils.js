const fs = require('fs')
const path = require('path')

const getPath = pathArray => {
  return path.join(...pathArray)
}

const getDirectories = srcPath => {
  return fs.readdirSync(srcPath).filter(file => fs.statSync(getPath([srcPath, file])).isDirectory())
}

const getFiles = srcPath => {
  return fs.readdirSync(srcPath).filter(file => fs.statSync(getPath([srcPath, file])).isFile())
}

module.exports = {
  getDirectories,
  getFiles,
  getPath
}
