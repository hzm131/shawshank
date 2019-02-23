const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let product
let token
beforeAll(async () => {
  token = await authHelper.login()

  product = await model.Product.forge({
    barcode: '123456789',
    abbreviation: 'bb',
    name: 'cc',
    type: 0,
    count: 11,
    purchase_price: 22,
    purchase_order_id: 4
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('products'),
  ])
})

describe('router/products', () => {
  it('get /v1/products', async () => {
    const res = await request(app.listen())
      .get('/v1/products?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/products with purchase_order_id filter', async () => {
    const res = await request(app.listen())
      .get('/v1/products?limit=10&offset=0&where_purchase_order_id_eq=1')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/products/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/products/${product.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/products', async () => {
    const res = await request(app.listen())
      .post('/v1/products')
      .send({
        barcode: '123456789',
        abbreviation: 'bbb',
        name: 'ccc',
        type: 0,
        count: 11,
        purchase_price: 22,
        purchase_order_id: 4
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('put /v1/products/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/products/${product.id}`)
      .send({
        barcode: '123456789',
        abbreviation: 'bbbb',
        name: 'cccc',
        type: 0,
        count: 11,
        purchase_price: 22,
        purchase_order_id: 1
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})
