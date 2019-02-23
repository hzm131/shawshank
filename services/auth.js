const jwt = require('jsonwebtoken')
const ms = require('ms')
const _ = require('lodash')
const uuidV4 = require('uuid/v4')
const redisClient = require('./redis-client') // 引用相对路径是为了方便直接使用这个文件
/**
 * SECRET_KEY
 */
const SECRET_KEY = process.env.SECRET_KEY
if (!SECRET_KEY) {
  throw new Error('找不到SECRET_KEY, 请检查环境变量是否设置了SECRET_KEY')
}

/**
 * 清除 sorted set 中过期的数据
 */
function cleanOutdateToken(key) {
  return redisClient.zremrangebyscore(key, 0, Date.now())
}

// serializeUserId(100500, {
// tokenExpiresIn: '1h',
// refreshExpiresIn: '1h',
// issuer: '222'
// })

/**
 * 序列号userId, 返回token
 *
 * @param {number} userId - 用户ID
 * @param {object} options - 参考https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
 */
async function serializeUserId(userId, options = {}) {
  const iat = Math.floor(Date.now() / 1000) - 30 // 防止时间不同步导致显示认证失败
  const sessionId = uuidV4()
  const tokenId = uuidV4()
  const refreshId = uuidV4()

  const accessToken = jwt.sign({
    uid: userId,
    iat,
    sid: sessionId
  }, SECRET_KEY, {
    expiresIn: options.tokenExpiresIn,
    issuer: options.issuer,
    subject: 'access_token',
    jwtid: tokenId
  })

  const refreshToken = jwt.sign({
    uid: userId,
    iat,
    sid: sessionId
  }, SECRET_KEY, {
    expiresIn: options.refreshExpiresIn,
    issuer: options.issuer,
    subject: 'refresh_token',
    jwtid: refreshId
  })

  const tokenExpiresIn = (iat * 1000) + ms(options.tokenExpiresIn)
  const refreshExpiresIn = (iat * 1000) + ms(options.refreshExpiresIn)
  const sessionExpireIn = (tokenExpiresIn > refreshExpiresIn) ? tokenExpiresIn : refreshExpiresIn

  await redisClient.multi()
    .zadd(`auth:${userId}:sessions`, sessionExpireIn, `${tokenId},${refreshId}`)
    .set(`auth:tokens:${tokenId}`, accessToken, 'px', sessionExpireIn)
    .set(`auth:tokens:${refreshId}`, refreshToken, 'px', sessionExpireIn)
    .set(`auth:sessions:${sessionId}`, `${tokenId},${refreshId}`, 'px', sessionExpireIn)
    .execAsync()

  _.delay(() => cleanOutdateToken(`auth:${userId}:sessions`))

  return {
    access_token: accessToken,
    refresh_token: refreshToken
  }
}

/**
 * 反序列化userId, 返回userId
 *
 * @param {boolean} options.raw - 是否将反序列化的所有内容取出
 */
async function deserializeUserId(token, options = {}) {
  let decoded
  const raw = options.raw || false
  const subject = options.subject || 'access_token'

  try {
    decoded = jwt.verify(token, SECRET_KEY, {
      subject
    })
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return Promise.reject({ code: 401002 }) // token 超时
    }

    if (e.name === 'JsonWebTokenError') {
      return Promise.reject({ code: 401005 }) // token 的签名验证不通过
    }

    throw e
  }

  if (await redisClient.getAsync(`auth:blocks:${decoded.sid}`)) {
    return Promise.reject({ code: 401004 }) // token 被禁用
  }

  if (raw) {
    return decoded
  }

  return decoded.uid
}


/**
 * 获取用户的Session列表
 */
async function getSessionByUserId(userId) {
  const sessions = await redisClient.zrangebyscoreAsync(`auth:${userId}:sessions`, Date.now(), '+inf')

  const tokens = await Promise.all(
    sessions
      .map((session) => {
        const tokenId = session.split(',')[0]

        return redisClient.getAsync(`auth:tokens:${tokenId}`)
      }))

  const tokenContents = await Promise.all(
    tokens
      .map(token => deserializeUserId(token, { raw: true }).catch(e => null))); // eslint-disable-line

  return tokenContents.filter(t => !!t)
}

async function getUserIdBySessionId(sessionId) {
  const [tokenId] = (await redisClient.getAsync(`auth:sessions:${sessionId}`)).split(',')
  const token = await redisClient.getAsync(`auth:tokens:${tokenId}`)
  return deserializeUserId(token)
}

/**
 * block 一个session
 */
async function blockSession(sessionId) {
  const ttl = await redisClient.ttlAsync(`auth:sessions:${sessionId}`)
  return redisClient.setAsync(`auth:blocks:${sessionId}`, true, 'px', ttl)
}

/**
 * 取消block session
 */
async function unblockSession(sessionId) {
  return redisClient.delAsync(`auth:blocks:${sessionId}`)
}

/**
 * revoke 该用户之前 release 的所有token
 */
async function blockAllSessionByUserId(userId) {
  const tokens = await getSessionByUserId(userId)

  return Promise.all(tokens.map(token => blockSession(token.sid)))
}

module.exports = {
  serializeUserId,
  deserializeUserId,
  getSessionByUserId,
  getUserIdBySessionId,
  blockSession,
  unblockSession,
  blockAllSessionByUserId
}
