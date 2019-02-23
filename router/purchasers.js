const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')

/**
@oas-path
/v1/purchasers:
  get:
    summary: 获取采购员列表
    security: [{ token: [] }]
    tags:
      - Purchaser
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
      - name: person.name~like
        in: query
        description: 按名称过滤采购员
        schema:
          type: string
      - name: person.abbreviation~like
        in: query
        description: 按简称过滤采购员
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
                    $ref: '#/components/schemas/Purchaser'
*/
router.get('/v1/purchasers', async ctx => {
  await ctx.ensureLogin()

  const query = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required(),
    'person.name~like': Joi.string(),
    'person.abbreviation~like': Joi.string()
  })

  const { offset, limit } = query

  const builder = model.Purchaser.forge().query(qb => {
    qb.innerJoin(
      'people',
      'people.id',
      'purchasers.person_id'
    )



    if (query['person.name~like']) {
      qb.where('people.name', 'like', query['person.name~like'].replace(/\*/g, '%'))
    }

    if (query['person.abbreviation~like']) {
      qb.where(
        'people.abbreviation',
        'like',
        query['person.abbreviation~like'].replace(/\*/g, '%')
      )
    }
  })

  const result = await builder.fetchPage({
    limit,
    offset,
    withRelated: ['person']
  })

  ctx.body = {
    count: result.pagination.rowCount,
    rows: result
  }
})

module.exports = router
