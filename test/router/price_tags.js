const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let org
let token
beforeAll(async () => {
  token = await authHelper.login()

  org = await model.PriceTag.forge({
    price:123,
    uuid:'a32f1bbf-bbb5-44e3-96ab-a25ce5b18195',
    product_instance_id:1
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('price_tags'),
  ])
})

describe('router/price_tags', () => {
  it('get /v1/price_tags', async () => {
    const res = await request(app.listen())
      .get('/v1/price_tags?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/price_tags/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/price_tags/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/price_tags', async () => {
    const res = await request(app.listen())
      .post('/v1/price_tags')
      .send({
        price:234,
        uuid:'a32f1bbf-bbb5-44e3-96ab-a25ce5b18195',
        product_instance_id:1
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
  it('put /v1/price_tags/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/price_tags/${org.id}`)
      .send({
        price:235,
        uuid:'a32f1bbf-bbb5-44e3-96ab-a25ce5b18195',
        product_instance_id:1
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('delete /v1/price_tags/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/price_tags/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})

