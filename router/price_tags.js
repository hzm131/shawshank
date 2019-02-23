const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')


/**
@oas-path
/v1/price_tags:
  get:
    summary: 价签
    security: [{ token: [] }]
    tags:
      - PriceTag
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
                    $ref: '#/components/schemas/PriceTag'
*/
router.get('/v1/price_tags', async ctx => {
  await ctx.ensureLogin()

  const { offset, limit,where_uuid_eq } = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
    where_uuid_eq: Joi
      .string()
      .uuid(),
  })
  const query = { where: {} }

  if(where_uuid_eq){
    query.where.uuid = where_uuid_eq
  }

  const result = await model.PriceTag.forge().query(query).orderBy('-created_at').fetchPage({
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
/v1/price_tags/{id}:
  get:
    summary: 获取单个价签
    security: [{ token: [] }]
    tags:
    - PriceTag
    parameters:
    - name: id
      in: path
      description: 单个价签
      schema:
        type: integer
        format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PriceTag'
*/
router.get('/v1/price_tags/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.PriceTag.where({ id }).fetch()

  ctx.body = result
})


/**
@oas-path
/v1/price_tags:
  post:
    summary: 创建价签表
    security: [{ token: [] }]
    tags:
      - PriceTag
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/PriceTag'
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
router.post('/v1/price_tags', async ctx => {
  await ctx.ensureLogin()

  const {
    price,
    uuid,
    product_instance_id
  } = await validate(ctx.request.body, {
    product_instance_id: Joi.number(),
    uuid:Joi.string(),
    price:Joi.number()
  })

  const result = await model.PriceTag.forge({
    price,
    uuid,
    product_instance_id
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})


/**
@oas-path
/v1/price_tags/{id}:
  put:
    summary: 价签实例
    security: [{ token: [] }]
    tags:
      - PriceTag
    parameters:
    - name: id
      in: path
      description: 价签id
      schema:
        type: integer
        format: int32
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/PriceTag'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PriceTag'
*/
router.put('/v1/price_tags/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    price,
    uuid,
    product_instance_id
  } = await validate(ctx.request.body, {
    product_instance_id: Joi.number(),
    uuid:Joi.string(),
    price:Joi.number()
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })

  await model.PriceTag.forge({
    id
  }).save({
    price,
    uuid,
    product_instance_id
  })

  ctx.body = {
    message: '更新成功'
  }
})

/**
@oas-path
/v1/price_tags/{id}:
  delete:
    summary: 删除价签
    security: [{ token: [] }]
    tags:
    - PriceTag
    parameters:
    - name: id
      in: path
      description: 价签ID
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
router.delete('/v1/price_tags/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.PriceTag.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})

module.exports = router
