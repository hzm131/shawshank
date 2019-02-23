const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')

/**
@oas-path
/v1/customers:
  get:
    summary: 客户表
    security: [{ token: [] }]
    tags:
      - Customer
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
                    $ref: '#/components/schemas/Customer'
*/
router.get('/v1/customers', async ctx => {
  await ctx.ensureLogin()

  const { offset, limit } = await validate(ctx.query, { //获取前台请求 验证参数
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
  })

  const result = await model.Customer.forge().orderBy('-created_at').fetchPage({  //拿到数据库中的数据根据创建时间降序排列，再分页
    limit,  //当前位置
    offset,  //偏移量
  })

  ctx.body = {  //返回给前台一个对象 count是全部数据条数   rows是当前位置的数据
    count: result.pagination.rowCount,
    rows: result
  }
})

/**
@oas-path
/v1/customers/{id}:
  get:
    summary: 单个客户表
    security: [{ token: [] }]
    tags:
    - Customer
    parameters:
    - name: id
      in: path
    description: 客户id
    schema:
      type: integer
      format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Customer'
*/
router.get('/v1/customers/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.Customer.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/customers:
  post:
    summary: 客户表
    security: [{ token: [] }]
    tags:
      - Customer
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Customer'
*/
router.post('/v1/customers', async ctx => {
  await ctx.ensureLogin()

  const {
    member_card_number,
    person_id
  } = await validate(ctx.request.body, {
    member_card_number: Joi.string().allow(''),
    person_id: Joi.number().integer(),
  })

  const result = await model.Customer.forge({
    member_card_number,
    person_id
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})


/**
@oas-path
/v1/customers:
  put:
    summary: 更新客户表
    security: [{ token: [] }]
    tags:
      - Customer
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Customer'
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
router.put('/v1/customers/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    member_card_number,
    person_id
  } = await validate(ctx.request.body, {
    member_card_number: Joi.number(),
    person_id: Joi.number(),
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })


  await model.Customer.forge({
    id
  }).save({
    member_card_number,
    person_id
  })

  ctx.body = {
    message: '更新成功'
  }
})

/**
@oas-path
/v1/customers/{id}:
  delete:
    summary: 删除客户表
    security: [{ token: [] }]
    tags:
    - Customer
    parameters:
    - name: id
      in: path
      description: 客户表id
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
router.delete('/v1/customers/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.Customer.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})


module.exports = router
