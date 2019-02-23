const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')
const validate = require('../lib/validate')


/**
@oas-path
/v1/salesmen:
  get:
    summary: 销售员列表
    security: [{ token: [] }]
    tags:
      - Salesman
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
      - in: query
        name: withRelated
        description: 关联相关数据
        schema:
          type: array
          items:
            type: string
            enum:
            - person
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
                    $ref: '#/components/schemas/Salesman'
*/
router.get('/v1/salesmen', async ctx => {
  await ctx.ensureLogin()

  ctx.query.withRelated = ctx.query.withRelated? ctx.query.withRelated.split(','): []

  const { offset, limit, withRelated } = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
    withRelated: Joi.array().items(Joi.string().valid('person')),
  })

  const result = await model.Salesman.forge().orderBy('-created_at').fetchPage({
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
/v1/salesmen/{id}:
  get:
    summary: 销售员详情
    security: [{ token: [] }]
    tags:
    - Salesman
    parameters:
    - name: id
      in: path
    description: 获取单个销售员
    schema:
      type: integer
      format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Salesman'
*/
router.get('/v1/salesmen/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.Salesman.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/salesmen:
  post:
    summary: 创建销售员
    security: [{ token: [] }]
    tags:
      - Salesman
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Salesman'
*/
router.post('/v1/salesmen', async ctx => {
  await ctx.ensureLogin()

  const { person_id } = await validate(ctx.request.body, {
    person_id: Joi.number()
  })

  const result = await model.Salesman.forge({
    person_id
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/salesmen/{id}:
  delete:
    summary: 删除当前销售员
    security: [{ token: [] }]
    tags:
    - Salesman
    parameters:
    - name: id
      in: path
      description: 销售员id
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
router.delete('/v1/salesmen/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.Salesman.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})


module.exports = router
