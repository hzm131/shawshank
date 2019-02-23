const Koa = require('koa')

/**
 * middlewares
 */
const cors = require('kcors')
const bodyParser = require('koa-bodyparser')
const errorHandler = require('./lib/middleware-error-handler')
const ensureLogin = require('./lib/middleware-ensure-login')

/**
 * init
 */
const app = new Koa()

const router = require('./router')
const auth = require('./services/auth')

app
  // 注册中间件
  .use(errorHandler())
  .use(cors({
    maxAge: 60 * 60 * 24 * 30,
    exposeHeaders: ['X-Error-Code'] // 用于暴露错误码到客户端
  }))
  .use(bodyParser())
  .use(ensureLogin({
    deserialize: auth.deserializeUserId
  }))
    .use((ctx,next)=>{
        ctx.ifYanzheng = async (deserializeOptions)=>{
            if(!ctx.header.authorization){
                return Promise.reject({ code: 401001 })
            }
            const [type,credentials] =  ctx.header.authorization.split(' ')
            if (type !== 'Bearer') {
                return Promise.reject({ code: 401003 }) // access_token 不合法
            }
            return auth.deserializeUserId(credentials, deserializeOptions) //反序列化token
        }
        return next()
    })
  // 注册路由
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
