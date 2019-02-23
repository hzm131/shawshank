const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

// eslint-disable-next-line
let pack
let token
beforeAll(async () => {
  token = await authHelper.login()

  pack  = await model.Package.forge({
    uuid: 'ba00c8d5-5467-42a1-9a0f-d42a6698694c',
    container_id: 2
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('packages'),
  ])
})

describe('router/packages', () => {
  it('get /v1/packages', async () => {
    const res = await request(app.listen())
      .get('/v1/packages?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/packages/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/packages/${pack.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/packages', async () => {
    const res = await request(app.listen())
      .post('/v1/packages')
      .send({
        uuid: 'ba00d8d5-5467-42a1-9a0f-d42a6698694c',
        container_id: 2
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('put /v1/packages/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/packages/${pack.id}`)
      .send({
        uuid: 'ba00c8d5-5467-42a1-9a0f-d42a6698694c',
        container_id: 2
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('delete /v1/packages/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/packages/${pack.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})
