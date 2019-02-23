const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')
const pinyin = require('pinyin')
const validate = require('../lib/validate')

/**
@oas-path
/v1/people:
  get:
    summary: 获取人员信息
    security: [{ token: [] }]
    tags:
      - Person
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
                    $ref: '#/components/schemas/Person'
*/
router.get('/v1/people', async ctx => {
  await ctx.ensureLogin()

  const { offset, limit } = await validate(ctx.query, {
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required()
  })

  const result = await model.Person.forge().orderBy('-created_at').fetchPage({
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
/v1/people/{id}:
  get:
    summary: 获取人员信息
    security: [{ token: [] }]
    tags:
    - Person
    parameters:
    - name: id
      in: path
      description: 获取单个人员信息
      schema:
        type: integer
        format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Person'
*/
router.get('/v1/people/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.Person.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/people:
  post:
    summary: 获取人员信息
    security: [{ token: [] }]
    tags:
      - Person
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Person'
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
router.post('/v1/people', async ctx => {
  await ctx.ensureLogin()

  const {
    mobile,
    name,
    email,
    sex,
    job,
    birthday,
    birthday_infer,
    identification_number,
    educational_background,
  } = await validate(ctx.request.body, {
    mobile:Joi.string().allow(''),
    created_at:Joi.string(),
    name: Joi.string(),
    abbreviation: Joi.string(),
    email: Joi.string().email(),
    sex: Joi.number().allow(0,1),
    job: Joi.string(),
    birthday: Joi.date(),
    birthday_infer: Joi.date(),
    identification_number: Joi.number(),
    educational_background: Joi.string(),
  })


  const result = await model.Person.forge({
    mobile,
    name,
    abbreviation: pinyin(name,{
      style: pinyin.STYLE_FIRST_LETTER
    }).join(''),
    email,
    sex,
    job,
    birthday,
    birthday_infer,
    identification_number,
    educational_background,
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/people:
  put:
    summary: 获取人员信息
    security: [{ token: [] }]
    tags:
      - Person
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Person'
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
router.put('/v1/people/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    mobile,
    name,
    abbreviation,
    email,
    sex,
    job,
    birthday,
    birthday_infer,
    identification_number,
    educational_background,
  } = await validate(ctx.request.body, {
    mobile:Joi.string(),
    name: Joi.string(),
    abbreviation: Joi.string(),
    email: Joi.string().email(),
    sex: Joi.number().allow(0,1),
    job: Joi.string(),
    birthday: Joi.date(),
    birthday_infer: Joi.date(),
    identification_number: Joi.number(),
    educational_background: Joi.string(),
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })

  await model.Person.forge({
    id
  }).save({
    mobile,
    name,
    abbreviation,
    email,
    sex,
    job,
    birthday,
    birthday_infer,
    identification_number,
    educational_background,
  })

  ctx.body = {
    message: '更新成功'
  }
})

module.exports = router
