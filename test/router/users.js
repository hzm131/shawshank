const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const auth = require('../../services/auth')

afterAll(async () => {
  await Promise.all([
    utilHelper.cleanTable('user_login_logs'),
    utilHelper.cleanTable('users')
  ])
})

describe('router/users', () => {
  it('post /v1/users/login - password', async () => {
    return authHelper.login()
  })

  it('post /v1/users/login - with wrong password', async () => {
    const username = '18616251325'
    const loginPassword = 'wrong_password'

    const res = await request(app.listen())
      .post('/v1/users/login')
      .send({
        grant_type: 'password',
        username,
        password: loginPassword
      })

    expect(res.status).toBe(403)
    expect(res.body).toEqual(utilHelper.getErrorBodyByCode(403002))
  })

  it('post /v1/users/login - refresh_token', async () => {
    const token = await authHelper.login()

    const res = await request(app.listen())
      .post('/v1/users/login')
      .send({
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token
      })

    expect(res.status).toBe(200)
  })

  it('get /v1/users/me/sessions', async () => {
    const token = await authHelper.login()

    const res = await request(app.listen())
      .get('/v1/users/me/sessions')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send()

    expect(res.status).toBe(200)
  })

  it('post /v1/users/me/block_session - do not has sessionId', async () => {
    const token = await authHelper.login()

    const res = await request(app.listen())
      .post('/v1/users/me/block_session')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send()

    expect(res.status).toBe(400)
  })

  it('post /v1/users/me/block_session - block a sessions', async () => {
    const token = await authHelper.login()
    const decodedToken = await auth.deserializeUserId(token.access_token, {
      raw: true
    })

    const res = await request(app.listen())
      .post('/v1/users/me/block_session')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send({
        sessionId: decodedToken.sid
      })

    expect(res.status).toBe(200)
  })

  // eslint-disable-next-line
  it("post /v1/users/me/block_session - cannot block other user's session", async () => {
    const loginToken = await authHelper.login()

    const token = await authHelper.generateTokenByUserId(-1)
    const decodedToken = await auth.deserializeUserId(token.access_token, {
      raw: true
    })

    const res = await request(app.listen())
      .post('/v1/users/me/block_session')
      .set('Authorization', `Bearer ${loginToken.access_token}`)
      .send({
        sessionId: decodedToken.sid
      })

    expect(res.status).toBe(403)
    expect(res.body).toEqual(utilHelper.getErrorBodyByCode(403003))
  })

  it('post /v1/users/me/block_other_sessions', async () => {
    const token = await authHelper.login()

    const res = await request(app.listen())
      .post('/v1/users/me/block_other_sessions')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send()

    expect(res.status).toBe(200)
  })

  it('post /v1/users/me/block_current_session', async () => {
    const token = await authHelper.login()

    const res = await request(app.listen())
      .post('/v1/users/me/block_current_session')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send()

    expect(res.status).toBe(200)
  })
})
