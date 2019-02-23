const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')
const validate = require('../lib/validate')


/**
@oas-path
/v1/optometrists:
  get:
    summary: 验光师
    security: [{ token: [] }]
    tags:
      - Optometrist
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
                    $ref: '#/components/schemas/Optometrist'
*/
router.get('/v1/optometrists', async ctx => {
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

  const result = await model.Optometrist.forge().orderBy('-created_at').fetchPage({
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
/v1/optometrists/{id}:
  get:
    summary: 验光师
    security: [{ token: [] }]
    tags:
    - Optometrist
    parameters:
    - name: id
      in: path
    description: 获取单个验光师
    schema:
      type: integer
      format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Optometrist'
*/
router.get('/v1/optometrists/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.Optometrist.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/optometrists:
  post:
    summary: 创建眼镜装配师
    security: [{ token: [] }]
    tags:
      - Optometrist
    parameters:
      - $ref: '#/components/parameters/limitParam'
      - $ref: '#/components/parameters/offsetParam'
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Optometrist'
*/
router.post('/v1/optometrists', async ctx => {
  await ctx.ensureLogin()

  const { person_id} = await validate(ctx.request.body, {
    person_id: Joi.number()
  })

  const result = await model.Optometrist.forge({
    person_id
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/optometrists:
  put:
    summary: 更新眼镜装配师
    security: [{ token: [] }]
    tags:
      - Optometrist
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Optometrist'
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
router.put('/v1/optometrists/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    person_id
  } = await validate(ctx.request.body, {
    person_id: Joi.number(),
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })


  await model.Optometrist.forge({
    id
  }).save({
    person_id
  })

  ctx.body = {
    message: '更新成功'
  }
})

/**
@oas-path
/v1/optometrists/{id}:
  delete:
    summary: 删除验光师
    security: [{ token: [] }]
    tags:
    - Optometrist
    parameters:
    - name: id
      in: path
      description: 验光师id
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
router.delete('/v1/optometrists/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  await model.Optometrist.forge({ id }).destroy()

  ctx.body = {
    message: '删除成功'
  }
})


module.exports = router
