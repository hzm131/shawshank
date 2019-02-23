const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let productInstance
let token
beforeAll(async () => {
  token = await authHelper.login()

  productInstance = await model.ProductInstance.forge({
    uuid: 'ba00c8d5-5467-42a1-9a0f-d42a6698694c',
    product_id: 1,
    package_id: 1,
  }).save()

})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('product_instances'),
  ])
})

describe('router/product_instances', () => {
  it('get /v1/product_instances', async () => {
    const res = await request(app.listen())
      .get('/v1/product_instances?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })


  it('get /v1/product_instances with product_id filter', async () => {
    const res = await request(app.listen())
      .get('/v1/product_instances?limit=10&offset=0&where_product_id_eq=1')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(1)
  })

  it('get /v1/product_instances/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/product_instances/${productInstance.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/product_instances', async () => {
    const res = await request(app.listen())
      .post('/v1/product_instances')
      .send({
        uuid: 'ba00c8d5-5467-42a1-9a0f-d42a6698694c',
        product_id: 2,
        package_id: 2,
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('put /v1/product_instances/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/product_instances/${productInstance.id}`)
      .send({
        uuid: 'ba00c8d5-5467-42a1-9a0f-d42a6698694c',
        product_id: 3,
        package_id: 3,
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/product_instances/actions/count', async () => {
    const res = await request(app.listen())
      .get('/v1/product_instances/actions/count?where_uuid_eq=c34efcd4-e1b9-4ae4-8f87-c34efcd4c574')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(0)
  })

  it('delete /v1/product_instances/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/product_instances/${productInstance.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})
