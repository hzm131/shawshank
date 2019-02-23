const _ = require('lodash')
const errors = require('./errors')
const nunjucks = require('nunjucks')
const he = require('he')
const raven = require('../services/raven')

/**
 * handle 错误并根据错误码返回相应内容
 *
 * 如果错误是 Error 对象，则直接throw, 由 koa 返回 500 错误
 * 如果错误是 Promise.reject({code: ???}) 形式的，则为已注册的错误，由 errors 文件处理
 */
module.exports = () => async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (e) {
    if (e.isJoi) {
      ctx.status = 400
      ctx.body = {
        code: 400002,
        message: he.decode(_.get(e, 'details[0].message', '参数验证失败')),
        payload: e
      }
      return
    }

    if (_.isError(e)) {
      if(process.env.NODE_ENV !== 'test'){
        raven.captureException(e, ctx)
      }
      throw e
    }

    const errObj = errors[e.code]

    if (!errObj) {
      throw new Error('错误码未定义')
    }

    ctx.status = errObj.status
    const normalizedE = _.omit(e, 'code')

    ctx.set('X-Error-Code', e.code)

    // 如果除了code还传了其他参数进来，则使用 nunjucks 模板引擎渲染错误消息
    if (_.isEmpty(normalizedE)) {
      ctx.body = {
        code: e.code,
        message: errObj.message
      }
    } else {
      ctx.body = {
        code: e.code,
        message: nunjucks.renderString(errObj.message, e)
      }
    }
  }
}
