const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let obj
let token
beforeAll(async () => {
  token = await authHelper.login()

  obj = await model.Salesman.forge({
    person_id: 1
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('salesmen'),
  ])
})

describe('router/salesmen', () => {
  it('get /v1/salesmen', async () => {
    const res = await request(app.listen())
      .get('/v1/salesmen?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/salesmen/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/salesmen/${obj.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/salesmen', async () => {
    const res = await request(app.listen())
      .post('/v1/salesmen')
      .send({
        person_id: 2
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('delete /v1/salesmen/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/salesmen/${obj.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})

