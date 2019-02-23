const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let org
let token
beforeAll(async () => {
  token = await authHelper.login()

  org = await model.Customer.forge({
    member_card_number:1,
    person_id: 1
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('customers'),
  ])
})

describe('router/customers', () => {
  it('get /v1/customers', async () => {
    const res = await request(app.listen())
      .get('/v1/customers?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/customers/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/customers/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/customers', async () => {
    const res = await request(app.listen())
      .post('/v1/customers')
      .send({
        person_id: 2
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
  it('put /v1/customers/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/customers/${org.id}`)
      .send({
        person_id: 1
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('delete /v1/customers/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/customers/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})

