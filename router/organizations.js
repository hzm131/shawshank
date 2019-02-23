const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')

/**
@oas-path
/v1/organizations:
  get:
    summary: 获取机构列表
    security: [{ token: [] }]
    tags:
      - Organization
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
                    $ref: '#/components/schemas/Organization'
*/
router.get('/v1/organizations', async ctx => {
  await ctx.ensureLogin()
  const { offset, limit } = await validate(ctx.query, { //获取前台请求 验证参数
    offset: Joi.number()
      .integer()
      .min(0)
      .required(),
    limit: Joi.number()
      .integer()
      .min(1)
      .required()
  })

  const result = await model.Organization.forge().orderBy('-created_at').fetchPage({  //拿到数据库中的数据根据创建时间降序排列，再分页
    limit,  //当前位置
    offset  //偏移量
  })

  ctx.body = {  //返回给前台一个对象 count是全部数据条数   rows是当前位置的数据
    count: result.pagination.rowCount,
    rows: result
  }
})

/**
@oas-path
/v1/organizations:
  post:
    summary: 创建机构
    security: [{ token: [] }]
    tags:
      - Organization
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Organization'
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
router.post('/v1/organizations', async ctx => {
  await ctx.ensureLogin()

  const {
    name,
    abbreviation,
    address,
    zip_code,
    phone_number,
    credit_code
  } = await validate(ctx.request.body, {
    name: Joi.string().required(),
    abbreviation: Joi.string().required(),
    address: Joi.string().allow(''),
    zip_code: Joi.string().allow(''),
    phone_number: Joi.string().allow(''),
    credit_code: Joi.string().allow('')
  })

  const result = await model.Organization.forge({
    name,
    abbreviation,
    address,
    zip_code,
    phone_number,
    credit_code
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/organizations/{id}:
  get:
    summary: 获取单个机构
    security: [{ token: [] }]
    tags:
    - Organization
    parameters:
    - name: id
      in: path
      description: 机构ID
      schema:
        type: integer
        format: int32
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Organization'
*/
router.get('/v1/organizations/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const organization = await model.Organization.where({ id }).fetch()

  ctx.body = organization
})

/**
@oas-path
/v1/organizations/{id}:
  put:
    summary: '更新机构'
    security: [{ token: [] }]
    tags:
      - Organization
    parameters:
    - name: id
      in: path
      description: 要更新的机构id
      schema:
        type: integer
        format: int32
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Organization'
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
router.put('/v1/organizations/:id', async ctx => {
  const userId = await ctx.ensureLogin()

  const {
    name,
    abbreviation,
    address,
    zip_code,
    phone_number,
    credit_code
  } = await validate(ctx.request.body, {
    name: Joi.string(),
    abbreviation: Joi.string(),
    address: Joi.string().allow(''),
    zip_code: Joi.string().allow(''),
    phone_number: Joi.string().allow(''),
    credit_code: Joi.string().allow('')
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })

  const organization = await model.Organization.where({id}).fetch()

  if(organization){
    await model.OperationRecord.forge({
      user_id: userId,
      type: 'update',
      table_name: 'organizations',
      data: organization.toJSON()
    }).save()
  }

  await model.Organization.forge({
    id
  }).save({
    name,
    abbreviation,
    address,
    zip_code,
    phone_number,
    credit_code
  })

  ctx.body = {
    message: '更新成功'
  }
})

/**
@oas-path
/v1/organizations/{id}:
  delete:
    summary: 删除机构
    security: [{ token: [] }]
    tags:
    - Organization
    parameters:
    - name: id
      in: path
      description: 机构ID
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
router.delete('/v1/organizations/:id', async ctx => {
  const userId = await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const organization = await model.Organization.where({ id }).fetch()

  if (organization) {
    await model.OperationRecord.forge({
      user_id: userId,
      type: 'delete',
      table_name: 'organizations',
      data: organization.toJSON()
    }).save()

    await model.Organization.forge({ id }).destroy()
  }

  ctx.body = {
    message: '删除成功'
  }
})

module.exports = router
