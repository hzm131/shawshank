/* eslint-disable no-unused-vars */
const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')
const pinyin = require('pinyin')
const validate = require('../lib/validate')

/**
@oas-path
/v1/orders:
  get:
    summary: 销售订单表
    security: [{ token: [] }]
    tags:
      - Order
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
      - in: query
        name: where_name_or_mobile_or_member_card_number_like
        description: 按名称/卡号/电话过滤列表
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
                rows:
                  type: array
                  items:
                    $ref: '#/components/schemas/Order'
*/
router.get('/v1/orders', async ctx => {
  await ctx.ensureLogin()
  ctx.query.withRelated = ctx.query.withRelated? ctx.query.withRelated.split(','): []

  const {
    offset,
    limit,
    withRelated,
    where_name_or_mobile_or_member_card_number_like,
    where_name_or_abbreviation_mobile_or_member_card_number_like
  } = await validate(ctx.query, { //获取前台请求 验证参数
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
    withRelated:Joi.array().items(
      Joi.string().valid('customer.person','prescription.optometrist.person','salesman.person')
    ),
    where_name_or_mobile_or_member_card_number_like:Joi.string(),
    where_name_or_abbreviation_mobile_or_member_card_number_like:Joi.string(),
  })

  const query = { where: {} }

  const queryBuilder = model.Order.forge()
    .query(query)
    .orderBy('-created_at')

  if (where_name_or_mobile_or_member_card_number_like) {
    queryBuilder.query(qb => {
      qb.innerJoin(
        'customers',
        'customers.id',
        'orders.customer_id'
      )

      qb.innerJoin(
        'people',
        'people.id',
        'customers.person_id'
      )

      qb.where('people.name', 'like', `%${where_name_or_mobile_or_member_card_number_like}%`)
        .orWhere('people.mobile', 'like', `%${where_name_or_mobile_or_member_card_number_like}%`)
        .orWhere('customers.member_card_number', 'like', `%${where_name_or_mobile_or_member_card_number_like}%`)
    })
  }

  if(where_name_or_abbreviation_mobile_or_member_card_number_like){
    queryBuilder.query(qb => {
      qb.innerJoin(
        'customers',
        'customers.id',
        'orders.customer_id'
      )

      qb.innerJoin(
        'people',
        'people.id',
        'customers.person_id'
      )

      qb.where('people.name', 'like', `%${where_name_or_abbreviation_mobile_or_member_card_number_like}%`)
        .orWhere('people.abbreviation', 'like', `%${where_name_or_abbreviation_mobile_or_member_card_number_like}%`)
        .orWhere('people.mobile', 'like', `%${where_name_or_abbreviation_mobile_or_member_card_number_like}%`)
        .orWhere('customers.member_card_number', 'like', `%${where_name_or_abbreviation_mobile_or_member_card_number_like}%`)

    })
  }

  const result = await queryBuilder.fetchPage({
    limit,
    offset,
    withRelated
  })

  ctx.body = {  //返回给前台一个对象 count是全部数据条数   rows是当前位置的数据
    count: result.pagination.rowCount,
    rows: result
  }
})

/**
@oas-path
/v1/orders/{id}:
  get:
    summary: 获取单个销售订单表
    security: [{ token: [] }]
    tags:
    - Order
    parameters:
    - name: id
      in: path
      description: 销售订单表
      schema:
        type: integer
        format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Order'
*/
router.get('/v1/orders/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.Order.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/orders:
  post:
    summary: 创建销售表单
    security: [{ token: [] }]
    tags:
      - Order
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Order'
*/
router.post('/v1/orders', async ctx => {
  await ctx.ensureLogin()

  const {
    store_id,
    salesman_id,
    note,
    temp_product_items,
    customer_id,
    assembler_id,
    prescription_id,
    total_price,
  } = await validate(ctx.request.body, {
    store_id:Joi.number(),
    salesman_id: Joi.number(),
    note:Joi.string(),
    temp_product_items:Joi.string(),
    customer_id: Joi.number(),
    assembler_id: Joi.number(),
    prescription_id: Joi.number(),
    total_price: Joi.number(),
  })

  const result = await model.Order.forge({
    store_id,
    salesman_id,
    note,
    temp_product_items,
    customer_id,
    assembler_id,
    prescription_id,
    total_price,
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})


/**
@oas-path
/v1/orders:
  put:
    summary: 更新销售表单
    security: [{ token: [] }]
    tags:
      - Order
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Order'
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
router.put('/v1/orders/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    store_id,
    note,
    temp_product_items,
    salesman_id,
    customer_id,
    assembler_id,
    prescription_id,
    total_price,
  } = await validate(ctx.request.body, {
    store_id:Joi.number(),
    note:Joi.string(),
    temp_product_items:Joi.string(),
    customer_id: Joi.number(),
    salesman_id: Joi.number(),
    assembler_id: Joi.number(),
    prescription_id: Joi.number(),
    total_price: Joi.number(),
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })


  await model.Order.forge({
    id
  }).save({
    store_id,
    salesman_id,
    note,
    temp_product_items,
    customer_id,
    assembler_id,
    prescription_id,
    total_price,
  })

  ctx.body = {
    message: '更新成功'
  }
})

/**
@oas-path
/v1/orders/{id}:
  delete:
    summary: 删除销售表单
    security: [{ token: [] }]
    tags:
    - Order
    parameters:
    - name: id
      in: path
      description: 销售表单id
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
router.delete('/v1/orders/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.Order.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})


module.exports = router
