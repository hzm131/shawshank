const router = require('koa-router')()
const _ = require('lodash')
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')

/**
@oas-path
/v1/product_instances:
  get:
    summary: 商品实例表
    security: [{ token: [] }]
    tags:
      - ProductInstance
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
      - name: where_product_id_eq
        in: query
        description: 通过 product_id 过滤返回数据
        schema:
          type: integer
          minimun: 1
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInstance'
*/
router.get('/v1/product_instances', async ctx => {
  await ctx.ensureLogin()

  const { offset, limit,where_uuid_eq, where_product_id_eq, where_package_id_eq } = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
    where_product_id_eq: Joi.number()
      .integer()
      .min(1),
    where_package_id_eq: Joi.number()
      .integer()
      .min(1),
    where_uuid_eq: Joi.string().uuid(),
  })

  const query = { where: {} }
  if (where_product_id_eq) {
    query.where.product_id = where_product_id_eq
  }
  if(where_package_id_eq) {
    query.where.package_id = where_package_id_eq
  }
  if(where_uuid_eq){
    query.where.uuid = where_uuid_eq
  }

  const result = await model.ProductInstance.forge()
    .query(query)
    .orderBy('-created_at')
    .fetchPage({
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
/v1/product_instances/{id}:
  get:
    summary: 获取单个商品实例信息
    security: [{ token: [] }]
    tags:
    - ProductInstance
    parameters:
    - name: id
      in: path
      description: 商品实例表
      schema:
        type: integer
        format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInstance'
 */
router.get('/v1/product_instances/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required(),
  })

  const productiIstance = await model.ProductInstance.where({ id }).fetch()

  ctx.body = productiIstance
})

/**
@oas-path
/v1/product_instances:
  post:
    summary: 商品实例表
    security: [{ token: [] }]
    tags:
      - ProductInstance
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInstance'
*/
router.post('/v1/product_instances', async ctx => {
  await ctx.ensureLogin()

  const { uuid, product_id, package_id } = await validate(ctx.request.body, {
    uuid: Joi.string().guid(),
    product_id: Joi.number(),
    package_id: Joi.number()
  })

  const result = await model.ProductInstance.forge({
    uuid,
    product_id,
    package_id
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/product_instances/{id}:
  put:
    summary: 商品实例表
    security: [{ token: [] }]
    tags:
      - ProductInstance
    parameters:
    - name: id
      in: path
      description: 商品实例id
      schema:
        type: integer
        format: int32
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ProductInstance'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInstance'
*/
router.put('/v1/product_instances/:id', async ctx => {
  await ctx.ensureLogin()

  const { uuid, product_id, package_id } = await validate(ctx.request.body, {
    uuid: Joi.string().uuid(),
    product_id: Joi.number(),
    package_id: Joi.number()
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number()
      .integer()
      .required()
  })

  await model.ProductInstance.forge({
    id
  }).save({
    uuid,
    product_id,
    package_id
  })

  ctx.body = {
    message: '更新成功'
  }
})

/**
@oas-path
/v1/product_instances/actions/count:
  get:
    summary: 返回对应过滤条件的统计数据
    security: [{ token: [] }]
    tags:
      - ProductInstance
    parameters:
      - name: where_uuid_eq
        in: query
        descrption: 通过uuid过滤返回数据
        schema:
          type: string
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                count:
                  type: integer
                  description: 对应过滤条件的统计数据
*/
router.get('/v1/product_instances/actions/count', async ctx => {
  await ctx.ensureLogin()

  const { where_uuid_eq } = await validate(ctx.query, {
    where_uuid_eq: Joi.string().guid()
  })

  const query = { where: {} }
  if (where_uuid_eq) {
    query.where.uuid = where_uuid_eq
  }

  const count = await model.ProductInstance.forge()
    .query(query)
    .count('id')

  ctx.body = {
    count: _.toNumber(count)
  }
})

/**
@oas-path
/v1/product_instances/{id}:
  delete:
    summary: 删除机构
    security: [{ token: [] }]
    tags:
    - ProductInstance
    parameters:
    - name: id
      in: path
      description: 产品实例ID
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
router.delete('/v1/product_instances/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.ProductInstance.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})

module.exports = router
