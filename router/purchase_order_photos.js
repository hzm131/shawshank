const router = require('koa-router')()
const model = require('../model')
const _ = require('lodash')

const validate = require('../lib/validate')
const Joi = require('joi')

/**
@oas-path
/v1/purchase_order_photos:
  post:
    summary: 创建采购照片订单表
    security: [{ token: [] }]
    tags:
      - PurchaseOrderPhoto
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
router.post('/v1/purchase_order_photos', async ctx => {
  await ctx.ensureLogin()
  const {
    purchase_order_id,
    uuid,
    photo_url
  } = await validate(ctx.request.body, {
    purchase_order_id: Joi.number().required(),
    uuid: Joi.string().guid().required(),
    photo_url: Joi.string().required()
  })
  const result = await model.PurchaseOrderPhoto.forge({
    purchase_order_id,
    uuid,
    photo_url
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/purchase_order_photos/actions/count:
  get:
    summary: 返回对应过滤条件的统计数据
    security: [{ token: [] }]
    tags:
      - PurchaseOrderPhoto
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
router.get('/v1/purchase_order_photos/actions/count', async ctx => {
  await ctx.ensureLogin()

  const { where_uuid_eq } = await validate(ctx.query, {
    where_uuid_eq: Joi.string().guid()
  })

  const query = { where: {} }
  if (where_uuid_eq) {
    query.where.uuid = where_uuid_eq
  }

  const count = await model.PurchaseOrderPhoto.forge()
    .query(query)
    .count('id')

  ctx.body = {
    count: _.toNumber(count)
  }
})

module.exports = router
