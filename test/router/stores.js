const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let obj
let token
beforeAll(async () => {
  token = await authHelper.login()

  obj = await model.Store.forge({
    name:'名字',
    address:'门店地址',
    phone_number:'13122179125',
    organization_id:1,
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('stores'),
  ])
})

describe('router/stores', () => {
  it('get /v1/stores', async () => {
    const res = await request(app.listen())
      .get('/v1/stores?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/stores/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/stores/${obj.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/stores', async () => {
    const res = await request(app.listen())
      .post('/v1/stores')
      .send({
        name:'名字1',
        address:'门店地址1',
        phone_number:'13122179123',
        organization_id:3,
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('put /v1/stores/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/stores/${obj.id}`)
      .send({
        name:'名字2',
        address:'门店地址2',
        phone_number:'13122179124',
        organization_id:2,
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('delete /v1/stores/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/stores/${obj.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})

