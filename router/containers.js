const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')
const validate = require('../lib/validate')

/**
@oas-path
/v1/containers:
  get:
    summary: 货柜表
    security: [{ token: [] }]
    tags:
      - Container
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                count:
                  type: integer
                rows:
                  type: array
                  items:
                    $ref: '#/components/schemas/Container'
*/
router.get('/v1/containers', async ctx => {
  await ctx.ensureLogin()

  const { offset, limit } = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required()
  })

  const result = await model.Container.forge().orderBy('-created_at').fetchPage({
    limit,
    offset
  })

  ctx.body = {
    count: result.pagination.rowCount,
    rows: result
  }
})

/**
@oas-path
/v1/containers/{id}:
  get:
    summary: 货柜表
    security: [{ token: [] }]
    tags:
    - Container
    parameters:
    - name: id
      in: path
    description: 获取单个货柜
    schema:
      type: integer
      format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Container'
*/
router.get('/v1/containers/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.Container.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/containers:
  post:
    summary: 创建货柜
    security: [{ token: [] }]
    tags:
      - Container
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Container'
*/
router.post('/v1/containers', async ctx => {
  await ctx.ensureLogin()

  const { name} = await validate(ctx.request.body, {
    name: Joi.string().required(),
  })

  const result = await model.Container.forge({
    name
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/containers/{id}:
  delete:
    summary: 删除货柜
    security: [{ token: [] }]
    tags:
    - Container
    parameters:
    - name: id
      in: path
      description: 货柜ID
      schema:
        type: integer
        format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  description: 执行结果
*/
router.delete('/v1/containers/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.Container.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})
module.exports = router
