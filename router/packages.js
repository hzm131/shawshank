const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')

/**
@oas-path
/v1/packages:
  get:
    summary: 包装盒表单
    security: [{ token: [] }]
    tags:
      - Package
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
                    $ref: '#/components/schemas/Package'
*/
router.get('/v1/packages', async ctx => {
  await ctx.ensureLogin()
  ctx.query.withRelated = ctx.query.withRelated
    ? ctx.query.withRelated.split(',')
    : []

  const { offset, limit, where_container_id_eq,  withRelated,where_uuid_eq } = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
    where_container_id_eq: Joi.number()
      .integer()
      .min(1),
    where_uuid_eq: Joi
      .string()
      .uuid(),
    withRelated: Joi.array().items(Joi.string().valid('productInstances')),

  })
  const query = { where: {} }
  if (where_container_id_eq) {
    query.where.container_id = where_container_id_eq
  }
  if(where_uuid_eq){
    query.where.uuid = where_uuid_eq
  }
  const result = await model.Package.forge().query(query).orderBy('-created_at').fetchPage({
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
/v1/packages/{id}:
  get:
    summary: 包装盒表单
    security: [{ token: [] }]
    tags:
    - Package
    parameters:
    - name: id
      in: path
    description: 获取单个包装盒信息
    schema:
      type: integer
      format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Package'
*/
router.get('/v1/packages/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.Package.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/packages:
  post:
    summary: 包装盒表单
    security: [{ token: [] }]
    tags:
      - Package
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Package'
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
router.post('/v1/packages', async ctx => {
  await ctx.ensureLogin()

  const {
    uuid,
    container_id
  } = await validate(ctx.request.body, {
    uuid: Joi.string().guid(),
    container_id:Joi.number().required()
  })

  const result = await model.Package.forge({
    uuid,
    container_id
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/packages:
  put:
    summary: 包装盒表单
    security: [{ token: [] }]
    tags:
      - Package
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Package'
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
router.put('/v1/packages/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    uuid,
    container_id
  } = await validate(ctx.request.body, {
    uuid: Joi.string().guid(),
    container_id: Joi.number().required()
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })

  await model.Package.forge({
    id
  }).save({
    uuid,
    container_id
  })

  ctx.body = {
    message: '更新成功'
  }
})

/**
@oas-path
/v1/packages/{id}:
  delete:
    summary: 删除盒子
    security: [{ token: [] }]
    tags:
    - Package
    parameters:
    - name: id
      in: path
      description: 盒子id
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
router.delete('/v1/packages/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.Package.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})

module.exports = router
