const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

// eslint-disable-next-line
let log
let token
beforeAll(async () => {
  token = await authHelper.login()

  log = await model.UserLoginLog.forge({
    user_id: 2
  }).save()

})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('prescriptions'),
  ])
})

describe('router/user_login_logs', () => {
  it('get /v1/user_login_logs', async () => {
    const res = await request(app.listen())
      .get('/v1/user_login_logs?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/user_login_logs/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/user_login_logs/${log.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/user_login_logs', async () => {
    const res = await request(app.listen())
      .post('/v1/user_login_logs')
      .send({
        user_id: 2
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('put /v1/user_login_logs/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/user_login_logs/${log.id}`)
      .send({
        user_id: 2
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})
