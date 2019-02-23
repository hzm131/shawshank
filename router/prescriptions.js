const router = require('koa-router')()
const Joi = require('joi')
const model = require('../model')

const validate = require('../lib/validate')

/**
@oas-path
/v1/prescriptions:
  get:
    summary: 获取验光单列表
    security: [{ token: [] }]
    tags:
      - Prescription
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
                    $ref: '#/components/schemas/Prescription'
*/
router.get('/v1/prescriptions', async ctx => {
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

  const result = await model.Prescription.forge().orderBy('-created_at').fetchPage({
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
/v1/prescriptions/{id}:
  get:
    summary: 获取单个验光单数据
    security: [{ token: [] }]
    tags:
    - Prescription
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
              $ref: '#/components/schemas/Prescription'
*/
router.get('/v1/prescriptions/:id', async ctx => {
  await ctx.ensureLogin()

  const { id } = await validate(ctx.params, {
    id: Joi.number().required()
  })

  const result = await model.Prescription.where({ id }).fetch()

  ctx.body = result
})

/**
@oas-path
/v1/prescriptions:
  post:
    summary: 获取验光单列表
    security: [{ token: [] }]
    tags:
      - Prescription
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Prescription'
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
router.post('/v1/prescriptions', async ctx => {
  await ctx.ensureLogin()

  const {
    optometrist_id,
    use_for,
    vertex_distance,
    right_sphere,
    left_sphere,
    right_cylinder,
    left_cylinder,
    right_cylinder_axis,
    left_cylinder_axis,
    right_corrected_vision,
    left_corrected_vision,
    right_papillary_distance,
    left_papillary_distance,
    right_add,
    left_add,
    right_prism,
    right_prism_base,
    left_prism,
    left_prism_base,
  } = await validate(ctx.request.body, {
    optometrist_id:Joi.number().integer(),
    use_for: Joi.number().integer().allow(0, 1).required(),
    vertex_distance: Joi.number().required(),
    right_sphere: Joi.number().integer(),
    left_sphere: Joi.number().integer(),
    right_cylinder: Joi.number().integer(),
    left_cylinder: Joi.number().integer(),
    right_cylinder_axis: Joi.number().integer().min(0).max(180),
    left_cylinder_axis: Joi.number().integer().min(0).max(180),
    right_corrected_vision: Joi.number(),
    left_corrected_vision: Joi.number(),
    right_papillary_distance: Joi.number(),
    left_papillary_distance: Joi.number(),
    right_add: Joi.number().integer(),
    left_add: Joi.number().integer(),
    right_prism: Joi.number().integer(),
    right_prism_base: Joi.number().integer().allow(0, 1, 2, 3, -1),
    left_prism: Joi.number().integer(),
    left_prism_base: Joi.number().integer().allow(0, 1, 2, 3, -1),
    expires_at: Joi.date()
  })

  const result = await model.Prescription.forge({
    optometrist_id,
    use_for,
    vertex_distance,
    right_sphere,
    left_sphere,
    right_cylinder,
    left_cylinder,
    right_cylinder_axis,
    left_cylinder_axis,
    right_corrected_vision,
    left_corrected_vision,
    right_papillary_distance,
    left_papillary_distance,
    right_add,
    left_add,
    right_prism,
    right_prism_base,
    left_prism,
    left_prism_base,
  }).save()

  ctx.body = {
    message: '创建成功',
    id: result.id
  }
})

/**
@oas-path
/v1/prescriptions:
  put:
    summary: 获取验光单列表
    security: [{ token: [] }]
    tags:
      - Prescription
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Prescription'
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
router.put('/v1/prescriptions/:id', async ctx => {
  await ctx.ensureLogin()

  const {
    optometrist_id,
    use_for,
    vertex_distance,
    right_sphere,
    left_sphere,
    right_cylinder,
    left_cylinder,
    right_cylinder_axis,
    left_cylinder_axis,
    right_corrected_vision,
    left_corrected_vision,
    right_papillary_distance,
    left_papillary_distance,
    right_add,
    left_add,
    right_prism,
    right_prism_base,
    left_prism,
    left_prism_base,
  } = await validate(ctx.request.body, {
    optometrist_id:Joi.number().integer(),
    use_for: Joi.number().integer().allow(0, 1).required(),
    vertex_distance: Joi.number().required(),
    right_sphere: Joi.number().integer(),
    left_sphere: Joi.number().integer(),
    right_cylinder: Joi.number().integer(),
    left_cylinder: Joi.number().integer(),
    right_cylinder_axis: Joi.number().integer().min(0).max(180),
    left_cylinder_axis: Joi.number().integer().min(0).max(180),
    right_corrected_vision: Joi.number(),
    left_corrected_vision: Joi.number(),
    right_papillary_distance: Joi.number(),
    left_papillary_distance: Joi.number(),
    right_add: Joi.number().integer(),
    left_add: Joi.number().integer(),
    right_prism: Joi.number().integer(),
    right_prism_base: Joi.number().integer().allow(0, 1, 2, 3, -1),
    left_prism: Joi.number().integer(),
    left_prism_base: Joi.number().integer().allow(0, 1, 2, 3, -1),
    expires_at: Joi.date()
  })

  const { id } = await validate(ctx.params, {
    id: Joi.number().integer().required()
  })

  await model.Prescription.forge({
    id
  }).save({
    optometrist_id,
    use_for,
    vertex_distance,
    right_sphere,
    left_sphere,
    right_cylinder,
    left_cylinder,
    right_cylinder_axis,
    left_cylinder_axis,
    right_corrected_vision,
    left_corrected_vision,
    right_papillary_distance,
    left_papillary_distance,
    right_add,
    left_add,
    right_prism,
    right_prism_base,
    left_prism,
    left_prism_base,
  })

  ctx.body = {
    message: '更新成功'
  }
})
module.exports = router
