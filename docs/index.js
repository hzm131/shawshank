const glob = require('glob')
const yaml = require('js-yaml')
const fs = require('fs')
const _ = require('lodash')
const parseRoutes = require('./parseRoutes')

const nunjucks = require('nunjucks')
const variables = require('./variables')

const BASEPATH = __dirname

function loadYaml(path) {
  return yaml.safeLoad(
    nunjucks.renderString(fs.readFileSync(`${BASEPATH}/${path}`, 'utf8'), variables),
    { filename: path }
  )
}

function pathToObjPath(path) {
  return path.replace(/\.yaml$/, '').replace(/\//g, '.')
}

function loadDoc(rootFile) {
  return new Promise((resolve, reject) => {
    glob('**/*.yaml', { cwd: __dirname }, (err, files) => {
      if (err) {
        reject(err)
      }

      // 过滤rootfile
      const filteredFiles = files.filter(v => v !== rootFile)
      const root = loadYaml(rootFile)

      try {
        // 提取object
        const result = _.reduce(
          filteredFiles,
          (prev, v) => {
            _.set(prev, pathToObjPath(v), loadYaml(v))

            return prev
          },
          root
        )

        return resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  })
}

let docs
module.exports = async () => {
  if (docs) {
    return docs
  }

  docs = await loadDoc('root.yaml')
  docs.paths = await parseRoutes()
  return docs
}
