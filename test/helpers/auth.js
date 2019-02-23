const request = require('supertest')
const app = require('../../app')

const { sha256 } = require('../../lib/crypto')
const uuidV4 = require('uuid/v4')
const model = require('../../model')
const auth = require('../../services/auth')

const username = '18616251325'
const password = '123456'

const login = async () => {
  await model.knex.transaction(async t => {
    await model.knex.raw('TRUNCATE table users RESTART IDENTITY').transacting(t)

    await new model.User({
      username,
      password: sha256(password)
    }).save(null, { transacting: t })
  })

  const res = await request(app.listen())
    .post('/v1/users/login')
    .send({
      grant_type: 'password',
      username,
      password
    })

  expect(res.status).toBe(200)

  return res.body
}

const generateTokenByUserId = async (userId, options) => {
  const {
    tokenExpiresIn = '15 days',
    refreshExpiresIn = '17 days',
    issuer = '/test/helpers/generateTokenByUserId',
    jwtid = uuidV4()
  } = options || {}

  return auth.serializeUserId(userId, {
    tokenExpiresIn,
    refreshExpiresIn,
    issuer,
    jwtid
  })
}

module.exports = {
  login,
  generateTokenByUserId
}
