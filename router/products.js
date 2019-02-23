const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')

/**
@oas-path
/v1/products:
  get:
    summary: 商品数据表
    security: [{ token: [] }]
    tags:
      - Product
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
      - name: where_purchase_order_id_eq
        in: query
        description: 通过 purchase_order_id 过滤返回数据
        schema:
          type: integer
          minimun: 1
      - in: query
        name: withRelated
        description: 关联相关数据
        schema:
          type: array
          items:
            type: string
            enum:
            - productInstances
        style: form
        explode: false
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
                    $ref: '#/components/schemas/Product'
*/
router.get('/v1/products', async ctx => {
  await ctx.ensureLogin()
  ctx.query.withRelated = ctx.query.withRelated
    ? ctx.query.withRelated.split(',')
    : []

  const {
    offset,
    limit,
    where_purchase_order_id_eq,
    withRelated,
    where_uuid_eq
  } = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
    where_purchase_order_id_eq: Joi.number()
      .integer()
      .min(1),
    withRelated: Joi.array().items(Joi.string().valid('productInstances')),
    where_uuid_eq: Joi.string().uuid(),
  })

  const query = { where: {} }
  if (where_purchase_order_id_eq) {
    query.where.purchase_order_id = where_purchase_order_id_eq
  }
  if (where_uuid_eq) {
    query.where.uuid = where_uuid_eq
  }

  const result = await model.Product.forge()
    .query(query)
    .orderBy('-created_at')
    .fetchPage({
      limit,
      offset,
      withRelated
    })

  ctx.body = {
    count: result.pagination.rowCount,
    rows: result
  }
})

/**
@oas-path
/v1/products/{id}:
  get:
    summary: 获取单个商品数据信息
    security: [{ token: [] }]
    tags:
    - Product
    parameters:
    - name: id
      in: path
      description: 商品数据表
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
                count:
                  type: integer
                rows:
                  type: array
                  items:
                    $ref: '#/components/schemas/Product'
*/
router.get('/v1/products/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const product = await model.Product.where({ id }).fetch()

  ctx.body = product
})

/**
@oas-path
/v1/products:
  post:
    summary: 商品数据表
    security: [{ token: [] }]
    tags:
      - Product
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
                message:
                  type: string
                  description: 执行结果
                id:
                  type: integer
*/
router.post('/v1/products', async ctx => {
  await ctx.ensureLogin()

  const {
    barcode,
    abbreviation,
    name,
    type,
    count,
    purchase_price,
    purchase_order_id
  } = await validate(ctx.request.body, {
    barcode: Joi.string(),
    abbreviation: Joi.string(),
    name: Joi.string(),
    type: Joi.number(),
    count: Joi.number(),
    purchase_price: Joi.number(),
    purchase_order_id: Joi.number()
  })

  const result = await model.Product.forge({
    barcode,
    abbreviation,
    name,
    type,
    count,
    purchase_price,
    purchase_order_id
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/products:
  put:
    summary: 商品数据表
    security: [{ token: [] }]
    tags:
      - Product
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Product'
*/
router.put('/v1/products/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    barcode,
    abbreviation,
    name,
    type,
    count,
    purchase_price,
    purchase_order_id
  } = await validate(ctx.request.body, {
    barcode: Joi.string(),
    abbreviation: Joi.string(),
    name: Joi.string(),
    type: Joi.number(),
    count: Joi.number(),
    purchase_price: Joi.number(),
    purchase_order_id: Joi.number()
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number()
      .integer()
      .required()
  })

  await model.Product.forge({
    id
  }).save({
    barcode,
    abbreviation,
    name,
    type,
    count,
    purchase_price,
    purchase_order_id
  })

  ctx.body = {
    message: '更新成功'
  }
})

module.exports = router
