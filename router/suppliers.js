const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')

/**
@oas-path
/v1/suppliers:
  get:
    summary: 获取供应商列表
    security: [{ token: [] }]
    tags:
      - Supplier
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
      - name: organization.name~like
        in: query
        description: 按机构名称模糊查找
        schema:
          type: string
      - name: organization.abbreviation~like
        in: query
        description: 按机构名称模糊查找
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
                    $ref: '#/components/schemas/Supplier'
*/
router.get('/v1/suppliers', async ctx => {
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
    'organization.name~like': Joi.string(),
    'organization.abbreviation~like': Joi.string()
  })

  const { offset, limit } = query

  const builder = model.Supplier.forge().query(qb => {
    qb.innerJoin(
      'organizations',
      'organizations.id',
      'suppliers.organization_id'
    )

    if (query['organization.name~like']) {
      qb.where('organizations.name', 'like', query['organization.name~like'].replace(/\*/g, '%'))
    }

    if (query['organization.abbreviation~like']) {
      qb.where(
        'organizations.abbreviation',
        'like',
        query['organization.abbreviation~like'].replace(/\*/g, '%')
      )
    }
  })

  const result = await builder.fetchPage({
    limit,
    offset,
    withRelated: ['organization']
  })

  ctx.body = {
    count: result.pagination.rowCount,
    rows: result
  }
})

module.exports = router
