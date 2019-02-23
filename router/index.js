const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const debug = require('debug')('router')
const loadDocs = require('../docs')
const yaml = require('js-yaml')

const basename = path.basename(module.filename)

const {
  HIDE_OAS
} = process.env

fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach(file => {
    const name = file.replace('.js', '')
    debug(`load ${name}`)

    const route = require(`./${name}`) // eslint-disable-line

    // 准备路由
    router.use(route.routes())
    router.use(route.allowedMethods())

    return 0
  })

router.get('/oas.yaml', async ctx => {
  if(HIDE_OAS){
    return
  }

  const docs = await loadDocs()

  ctx.type = 'text/yaml'
  ctx.body = yaml.safeDump(docs)
})

router.get('/health_check', async ctx => {
  ctx.body = 'ok'
})

module.exports = router
