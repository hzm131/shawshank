const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')
const validate = require('../lib/validate')

/**
@oas-path
/v1/stores:
  get:
    summary: 获取门店
    security: [{ token: [] }]
    tags:
      - Store
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
      - in: query
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
                    $ref: '#/components/schemas/Store'
*/
router.get('/v1/stores', async ctx => {
  await ctx.ensureLogin()

  const { offset, limit} = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
  })

  const result = await model.Store.forge().orderBy('-created_at').fetchPage({
    limit,
    offset,
  })

  ctx.body = {
    count: result.pagination.rowCount,
    rows: result
  }
})

/**
@oas-path
/v1/stores/{id}:
  get:
    summary: 获取单个门店
    security: [{ token: [] }]
    tags:
    - Store
    parameters:
    - name: id
      in: path
    description: 门店id
    schema:
      type: integer
      format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Store'
*/
router.get('/v1/stores/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.Store.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/stores:
  post:
    summary: 创建门店
    security: [{ token: [] }]
    tags:
      - Store
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Store'
*/
router.post('/v1/stores', async ctx => {
  await ctx.ensureLogin()

  const { name, address, phone_number, organization_id} = await validate(ctx.request.body, {
    name:Joi.string(),
    address:Joi.string(),
    phone_number:Joi.string(),
    organization_id:Joi.number(),
  })

  const result = await model.Store.forge({
    name,
    address,
    phone_number,
    organization_id,
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/stores/{id}:
  put:
    summary: 更新门店信息
    security: [{ token: [] }]
    tags:
    - Store
    parameters:
    - name: id
      in: path
      description: 门店id
      schema:
        type: integer
        format: int32
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Store'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Store'
*/
router.put('/v1/stores/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    name,
    address,
    phone_number,
    organization_id,
  } = await validate(ctx.request.body, {
    name:Joi.string(),
    address:Joi.string(),
    phone_number:Joi.string(),
    organization_id:Joi.number(),
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })

  await model.Store.forge({
    id
  }).save({
    name,
    address,
    phone_number,
    organization_id,
  })

  ctx.body = {
    message: '更新成功'
  }
})

/**
@oas-path
/v1/stores/{id}:
  delete:
    summary: 删除门店
    security: [{ token: [] }]
    tags:
    - stores
    parameters:
    - name: id
      in: path
      description: 门店id
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
router.delete('/v1/stores/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.Store.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})

module.exports = router
