const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')

/**
@oas-path
/v1/user_login_logs:
  get:
    summary: 用户登录日志表
    security: [{ token: [] }]
    tags:
      - UserLoginLog
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
                    $ref: '#/components/schemas/UserLoginLog'
*/
router.get('/v1/user_login_logs', async ctx => {
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

  const result = await model.UserLoginLog.forge().orderBy('-created_at').fetchPage({
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
/v1/user_login_logs/{id}:
  get:
    summary: 获取用户登录日志
    security: [{ token: [] }]
    tags:
    - UserLoginLog
    parameters:
    - name: id
      in: path
      description: 验光单表
      schema:
        type: integer
        format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserLoginLog'
*/
router.get('/v1/user_login_logs/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.UserLoginLog.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/user_login_logs:
  post:
    summary: 用户登录日志表
    security: [{ token: [] }]
    tags:
      - UserLoginLog
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/UserLoginLog'
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
router.post('/v1/user_login_logs', async ctx => {
  await ctx.ensureLogin()

  const {
    user_id
  } = await validate(ctx.request.body, {
    user_id: Joi.number()
  })

  const result = await model.UserLoginLog.forge({
    user_id
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/user_login_logs:
  put:
    summary: 用户登录日志表
    security: [{ token: [] }]
    tags:
      - UserLoginLog
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/UserLoginLog'
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
router.put('/v1/user_login_logs/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    user_id
  } = await validate(ctx.request.body, {
    user_id: Joi.number()
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })

  await model.UserLoginLog.forge({
    id
  }).save({
    user_id
  })

  ctx.body = {
    message: '更新成功'
  }
})
module.exports = router
