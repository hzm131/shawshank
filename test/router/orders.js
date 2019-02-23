const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let org
let token
beforeAll(async () => {
  token = await authHelper.login()

  org = await model.Order.forge({
    store_id:1,
    note:'备注1',
    temp_product_items:'临时产品订单表1',
    customer_id:1,
    assembler_id:2,
    prescription_id:3,
    total_price:1222
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('orders'),
  ])
})

describe('router/orders', () => {
  it('get /v1/orders', async () => {
    const res = await request(app.listen())
      .get('/v1/orders?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/orders with where_name_or_mobile_or_member_card_number_like filter', async () => {
    const str = '文雷'
    const name = encodeURIComponent(str)
    const res = await request(app.listen())
      .get(`/v1/orders?limit=10&offset=0&withRelated=customer.person&where_name_or_mobile_or_member_card_number_like=${name}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/orders/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/orders/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/orders', async () => {
    const res = await request(app.listen())
      .post('/v1/orders')
      .send({
        store_id:1,
        note:'备注1',
        temp_product_items:'临时产品订单表1',
        customer_id:1,
        assembler_id:2,
        prescription_id:3,
        total_price:1222
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
  it('put /v1/orders/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/orders/${org.id}`)
      .send({
        store_id:1,
        note:'备注1',
        temp_product_items:'临时产品订单表1',
        customer_id:1,
        assembler_id:2,
        prescription_id:3,
        total_price:1
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('delete /v1/orders/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/orders/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})

