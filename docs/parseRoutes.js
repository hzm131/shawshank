const glob = require('glob')
const fs = require('fs')
const _ = require('lodash')
const babelParser = require('@babel/parser')
const yaml = require('js-yaml')
const path = require('path')

const nunjucks = require('nunjucks')
const variables = require('./variables')

const BASEPATH = path.resolve(__dirname, '../router')

function loadComments(path) {
  return babelParser.parse(fs.readFileSync(`${BASEPATH}/${path}`, 'utf8'))
    .comments
}

const OAS_PREFIX_REGEX = /^\*\n@oas-path/

function loadRoutes() {
  return new Promise((resolve, reject) => {
    glob(
      '**/*.js',
      { cwd: path.resolve(__dirname, '../router') },
      (err, files) => {
        if (err) {
          reject(err)
        }

        try {
          const result = _.reduce(
            files,
            (prev, v) => {
              // 过滤无效数据并转换成object
              const comments = _.chain(loadComments(v))
                .filter(v => v.type === 'CommentBlock')
                .filter(v => OAS_PREFIX_REGEX.test(v.value))
                .map(v => {
                  v.value = v.value.replace(OAS_PREFIX_REGEX, '')
                  return v.value
                })
                .map(v => nunjucks.renderString(v, variables))
                .map(v => yaml.safeLoad(v, { filename: v }))
                .value()

              const docs = _.reduce(comments, (prev, v) => _.merge(prev, v), {})

              return _.merge(prev, docs)
            },
            {}
          )

          return resolve(result)
        } catch (e) {
          reject(e)
        }
      }
    )
  })
}

module.exports = loadRoutes
