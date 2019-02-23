const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')
const validate = require('../lib/validate')

/**
@oas-path
/v1/before_pos_data:
  get:
    summary: 老销售数据
    security: [{ token: [] }]
    tags:
      - BeforePosData
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
      - in: query
        name: where_telephone_eq
        description: 电话
        schema:
          type: array
          items:
            type: string
      - in: query
        name: where_name_or_n5_or_telephone_like
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
                    $ref: '#/components/schemas/BeforePosData'
*/
router.get('/v1/before_pos_data', async ctx => {
  await ctx.ensureLogin()
  const {
    offset,
    limit,
    where_telephone_eq,
    where_n5_eq,
    where_name_eq,
    where_name_or_n5_or_telephone_like
  } = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
    where_name_eq: Joi.string(),
    where_name_or_n5_or_telephone_like: Joi.string(),
    where_telephone_eq: Joi.string(),
    where_n5_eq: Joi.string()
  })
  const query = { where: {} }

  if (where_telephone_eq) {
    query.where.telephone = where_telephone_eq
  }
  if (where_n5_eq) {
    query.where.n5 = where_n5_eq
  }
  if (where_name_eq) {
    const a = decodeURIComponent(where_name_eq) //解码
    query.where.name = a
  }

  const queryBuilder = model.BeforePosData.forge()
    .query(query)
    .orderBy('-lsh')

  if (where_name_or_n5_or_telephone_like) {
    queryBuilder.query(qb => {
      qb.where('name', 'like', `%${where_name_or_n5_or_telephone_like}%`)
        .orWhere('n5', 'like', `%${where_name_or_n5_or_telephone_like}%`)
        .orWhere('telephone', 'like', `%${where_name_or_n5_or_telephone_like}%`)
    })
  }

  const result = await queryBuilder.fetchPage({
    limit,
    offset
  })
  ctx.body = {
    count: result.pagination.rowCount,
    rows: result
  }
})

/**
@oas-path
/v1/before_pos_data/{id}:
  get:
    summary: 老销售数据表单个
    security: [{ token: [] }]
    tags:
    - BeforePosData
    parameters:
    - name: id
      in: path
      description: 单个销售数据表
      schema:
        type: integer
        format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BeforePosData'
*/
router.get('/v1/before_pos_data/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.BeforePosData.where({ id }).fetch()

  ctx.body = result
})

module.exports = router
