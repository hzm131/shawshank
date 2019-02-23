/**
 * ensureLogin 中间件
 *
 * 解析 token 并反序列化 token
 *
 * token 格式:
 *   Authorization: Bearer token
 *
 * example:
 *   const userId = await ensureLogin();
 *
 */
module.exports = ({ deserialize }) => async function ensureLogin(ctx, next) { //调用返回一个中间件函数

  ctx.ensureLogin = async (deserializeOptions) => {  //为ctx增加了一个方法
    if (!ctx.header.authorization) { //如果请求头中不存在授权
      return Promise.reject({ code: 401001 }) // 找不到 Authorization Header
    }

    const [type, credentials] = ctx.header.authorization.split(' ')

    if (type !== 'Bearer') {
      return Promise.reject({ code: 401003 }) // access_token 不合法
    }

    return deserialize(credentials, deserializeOptions)
  }

  return next()
}
