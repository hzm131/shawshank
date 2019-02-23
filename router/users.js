const router = require('koa-router')()
const ms = require('ms')
const uuidV4 = require('uuid/v4')
const Joi = require('joi')
const model = require('../model')
const { sha256 } = require('../lib/crypto')

const auth = require('../services/auth')
const { Locker } = require('../services/redlock')

const validate = require('../lib/validate')

/**
@oas-path
/v1/users/login:
  post:
    summary: 用户登录
    tags:
      - User
    requestBody:
      content:
        application/json:
          example:
            grant_type: password
            username: '18616251325'
            password: '123456'
          schema:
            type: object
            properties:
              grant_type:
                type: string
                enum: [ password, refresn_token ]
                description: '授权类型，表示使用"密码授权(password)"或"刷新token(refresh_token)"方式授权'
              username:
                type: string
                description: 用户名 注：当 grant_type=password 必须填写此项
              password:
                type: string
                description: 密码 注：当 grant_type=password 必须填写此项
              refresh_token:
                type: string
                description: 刷新token使用的token 注：当 grant_type=refresh_token 必须填写此项

    responses:
      200:
        description: 登录成功
        content:
          application/json:
            schema:
              type: 'object'
              properties:
                access_token:
                  type: string
                  description: token的内容
                token_type:
                  type: string
                  description: token的类型
                expires_in:
                  type: integer
                  description: token多久失效，以秒为单位
                refresh_token:
                  type: string
                  description: 获取最新的access_token使用的token
      403:
        $ref: '#/components/responses/403Forbidden'
*/
router.post('/v1/users/login', async ctx => {
  const {
    grant_type, // eslint-disable-line camelcase
    username,
    password,
    refresh_token // eslint-disable-line camelcase
  } = await validate(ctx.request.body, {
    grant_type: Joi.string().valid('password', 'refresh_token'),
    username: Joi.string()
      .trim()
      .min(6)
      .max(16)
      .label('用户名')
      .when('grant_type', { is: 'password', then: Joi.required() }),
    password: Joi.string()
      .trim()
      .min(6)
      .max(16)
      .label('密码')
      .when('grant_type', { is: 'password', then: Joi.required() }),
    refresh_token: Joi.string()
      .trim()
      .when('grant_type', { is: 'refresh_token', then: Joi.required() })
  })

  const tokenExpiresIn = '15 days'
  const refreshExpiresIn = '17 days'
  const issuer = '/v1/users/login'
  const jwtid = uuidV4()

  // eslint-disable-next-line camelcase
  if (grant_type === 'password') {
    /**
     * 登录步骤
     *
     * 1. 验证密码
     * 2. 生成Token
     */

    // 验证密码是否正确
    const userId = await login(username, password)

    // 生成 access_token
    const authObj = await auth.serializeUserId(userId, {
      tokenExpiresIn,
      refreshExpiresIn,
      issuer,
      jwtid
    })

    ctx.body = {
      access_token: authObj.access_token,
      token_type: 'jwt',
      expires_in: Math.floor(ms(tokenExpiresIn) / 1000),
      refresh_token: authObj.refresh_token
    }
    return
  }

  // eslint-disable-next-line camelcase
  if (grant_type === 'refresh_token') {
    /**
     * refresh_token 步骤
     *
     * 1. 验证token 是否有效并且是 refresh_token
     * 2. 用用户名生成新 token
     * 3. block 当前 session 的token (refresh_token 只能用一次，并且刷新后access_token变为无效token)
     */
    const tokenDetail = await auth.deserializeUserId(refresh_token, {
      subject: 'refresh_token',
      raw: true
    })

    // 获取一个锁锁定当前资源
    const authObj = await Locker(`${ctx.path}:${tokenDetail.uid}`)(async () => {
      // block session
      await auth.blockSession(tokenDetail.sid)

      return auth.serializeUserId(tokenDetail.uid, {
        tokenExpiresIn,
        refreshExpiresIn,
        issuer,
        jwtid
      })
    }).catch(() => Promise.reject({ code: 403001 })) // 当前资源正在被占用，请稍后再试

    ctx.body = {
      access_token: authObj.access_token,
      token_type: 'jwt',
      expires_in: Math.floor(ms(tokenExpiresIn) / 1000),
      refresh_token: authObj.refresh_token
    }
    return // eslint-disable-line
  }
})

/**
@oas-path
'/v1/users/me/sessions':
  get:
    summary: '获取当前用户的 session 列表'
    security: [{ token: [] }]
    description: ''
    tags:
      - Session
    responses:
      200:
        description: 获取成功
        content:
          application/json:
            schema:
              type: object
              properties:
                count:
                  type: integer
                  description: 总session数
                rows:
                  type: array
                  items:
                    type: object
                    properties:
                      uid:
                        type: integer
                        description: 用户Id
                      iat:
                        type: number
                        description: 授权 token 的时间
                      sid:
                        type: number
                        description: session 的 uuid
                      exp:
                        type: number
                        description: session 的过期时间
                      iss:
                        type: string
                        description: 授权 token 的地方
                      sub:
                        type: string
                        description: 授权 token 的主题, 作用
                      jti:
                        type: string
                        description: token 的 uuid
      401:
        $ref: '#/components/responses/401Unauthorized'
*/
router.get('/v1/users/me/sessions', async ctx => {
  const userId = await ctx.ensureLogin()

  const sessions = await auth.getSessionByUserId(userId)

  ctx.body = {
    rows: sessions,
    count: sessions.length
  }
})


/**
@oas-path
'/v1/users/me/block_session':
  post:
    summary: '取消一个 session 的访问权限'
    description: ''
    security: [{ token: [] }]
    tags:
      - Session
    requestBody:
      content:
        application/json:
          schema:
            type: object
          required:
            - sessionId
          example:
            sessionId: xxx
          properties:
            sessionId:
              type: string
              description: 'session 的 ID'
    responses:
      200:
        $ref: '#/components/responses/200OperationSuccess'
      401:
        $ref: '#/components/responses/401Unauthorized'
*/
router.post('/v1/users/me/block_session', async ctx => {
  const userId = await ctx.ensureLogin()
  const { sessionId } = ctx.request.body

  if (!sessionId) {
    return Promise.reject({ code: 400001 }) // sessionId 不合法
  }

  const tokenUserId = await auth.getUserIdBySessionId(sessionId)

  if (userId !== tokenUserId) {
    return Promise.reject({ code: 403003 }) // session 不属于当前用户
  }

  await auth.blockSession(sessionId)

  ctx.body = {
    data: sessionId
  }
})

/**
@oas-path
/v1/users/me/block_other_sessions:
  post:
    summary: 屏蔽其他session的访问权限（除当前session外)
    security: [{ token: [] }]
    description: ''
    tags:
      - Session
    responses:
      200:
        $ref: '#/components/responses/200OperationSuccess'
      401:
        $ref: '#/components/responses/401Unauthorized'
*/
router.post('/v1/users/me/block_other_sessions', async ctx => {
  const { uid, sid } = await ctx.ensureLogin({ raw: true })

  await auth.blockAllSessionByUserId(uid)
  await auth.unblockSession(sid)

  ctx.body = {
    message: '操作成功'
  }
})

/**
@oas-path
/v1/users/me/block_current_session:
  post:
    summary: '取消当前 session 的访问权限(登出操作)'
    security: [{ token: [] }]
    description: ''
    tags:
      - Session
    responses:
      200:
        $ref: '#/components/responses/200OperationSuccess'
      401:
        $ref: '#/components/responses/401Unauthorized'
*/
router.post('/v1/users/me/block_current_session', async ctx => {
  const { sid } = await ctx.ensureLogin({ raw: true })

  await auth.blockSession(sid)

  ctx.body = {
    message: '操作成功'
  }
})

module.exports = router

// ====================== helper

/**
 * 登录
 */
async function login(username, password) {
  const user = await model.User.where('username', username) //从数据库中查询username和password
    .where('password', sha256(password))
    .fetch()

  if (!user) {
    return Promise.reject({ code: 403002 }) // 手机号或密码不正确
  }

  // 写入登录日志
  await model.UserLoginLog.forge({
    user_id: user.id
  }).save()

  return user.id  //存在就返回id
}
