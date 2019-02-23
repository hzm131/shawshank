const router = require('koa-router')()
const model = require('../model')

const validate = require('../lib/validate')
const Joi = require('joi')

/**
@oas-path
/v1/purchase_orders:
  get:
    summary: 获取采购订单信息
    security: [{ token: [] }]
    tags:
      - PurchaseOrder
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
            - supplier.organization
            - purchaser.person
            - photos
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
                    $ref: '#/components/schemas/PurchaseOrder'
*/
router.get('/v1/purchase_orders', async ctx => {
  await ctx.ensureLogin()
  ctx.query.withRelated = ctx.query.withRelated? ctx.query.withRelated.split(','): []

  const { offset, limit, withRelated,where_uuid_eq } = await validate(ctx.query, {
    //获取前台请求 验证参数
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
    withRelated: Joi.array().items(
      Joi.string().valid('supplier.organization', 'purchaser.person', 'photos')
    ),
    where_uuid_eq: Joi.string().uuid(),
  })

  const query = { where: {} }
  if (where_uuid_eq) {
    query.where.uuid = where_uuid_eq
  }
  const result = await model.PurchaseOrder.forge()
    .query(query)
    .orderBy('-created_at')
    .fetchPage({
      limit, //当前位置
      offset, //偏移量
      withRelated
    })

  ctx.body = {
    count: result.pagination.rowCount,
    rows: result
  }
})

/**
@oas-path
/v1/purchase_orders/{id}:
  get:
    summary: 获取单个采购订单信息
    security: [{ token: [] }]
    tags:
    - PurchaseOrder
    parameters:
    - name: id
      in: path
      description: 采购订单
      schema:
        type: integer
        format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Product'
*/
router.get('/v1/purchase_orders/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const purchaseOrder = await model.PurchaseOrder.where({ id }).fetch()

  ctx.body = purchaseOrder
})

/**
@oas-path
/v1/purchase_orders:
  post:
    summary: 创建采购单
    security: [{ token: [] }]
    tags:
      - PurchaseOrder
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
router.post('/v1/purchase_orders', async ctx => {
  await ctx.ensureLogin()

  const result = await model.PurchaseOrder.forge({}).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/purchase_orders/{id}:
  put:
    summary: '更新采购单'
    security: [{ token: [] }]
    tags:
      - PurchaseOrder
    parameters:
    - name: id
      in: path
      description: 采购单id
      schema:
        type: integer
        format: int32
    requestBody:
      content:
        application/json:
          schema:
            type: object
            example:
              uuid: a8d67f0c-eedd-48d6-9930-e2c9401f23b7
              supplier_id: 1
              purchased_at: '2018-08-08T06:06:06Z'
              purchaser_id: 1
            properties:
              uuid:
                type: string
                description: 采购单uuid
              supplier_id:
                type: integer
                description: 供应商ID
              purchased_at:
                type: date-time
                description: 采购时间
              purchaser_id:
                type: integer
                description: 采购人ID
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
router.put('/v1/purchase_orders/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number()
      .integer()
      .required()
  })

  const { uuid, supplier_id, purchased_at, purchaser_id } = await validate(
    ctx.request.body,
    {
      uuid: Joi.string().uuid(),
      supplier_id: Joi.number().integer(),
      purchased_at: Joi.string().isoDate(),
      purchaser_id: Joi.number().integer()
    }
  )

  try {
    await model.PurchaseOrder.forge({ id }).save(
      {
        uuid,
        supplier_id,
        purchased_at,
        purchaser_id
      },
      { patch: true }
    )
  } catch (e) {
    return Promise.reject({ code: 403004 }) // 数据库操作出错，详情请联系系统管理员
  }

  ctx.body = {
    message: '更新成功'
  }
})

/**
@oas-path
/v1/purchase_orders/{id}:
  delete:
    summary: 删除采购订单
    security: [{ token: [] }]
    tags:
    - PurchaseOrder
    parameters:
    - name: id
      in: path
      description: 采购订单id
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
router.delete('/v1/purchase_orders/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.PurchaseOrder.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})



module.exports = router
