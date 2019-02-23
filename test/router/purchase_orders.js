const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const model = require('../../model')
const uuidV4 = require('uuid/v4')
const utilHelper = require('../helpers/util')

let order
let token
beforeAll(async () => {
  token = await authHelper.login()

  order = await model.PurchaseOrder.forge({
    uuid: uuidV4(),
    supplier_id: 2,
    purchased_at: new Date().toJSON(),
    purchaser_id: 2
  }).save()
})

afterAll(async ()=>{
  await utilHelper.cleanTable('purchase_orders')
})
describe('router/purchase_orders', () => {

  it('get /v1/purchase_orders', async () => {
    const res = await request(app.listen())
      .get('/v1/purchase_orders?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
  it('get /v1/purchase_orders/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/purchase_orders/${order.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/purchase_orders', async () => {
    const res = await request(app.listen())
      .post('/v1/purchase_orders')
      .send()
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('put /v1/purchase_orders/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/purchase_orders/${order.id}`)
      .send({
        uuid: uuidV4(),
        supplier_id: 1,
        purchased_at: new Date().toJSON(),
        purchaser_id: 1
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('delete /v1/purchase_orders/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/purchase_orders/${order.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})
