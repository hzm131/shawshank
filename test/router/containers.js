const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let org
let token
beforeAll(async () => {
  token = await authHelper.login()

  org = await model.Container.forge({
    name: '货柜'
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('containers'),
  ])
})

describe('router/containers', () => {
  it('get /v1/containers', async () => {
    const res = await request(app.listen())
      .get('/v1/containers?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/containers/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/containers/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/containers', async () => {
    const res = await request(app.listen())
      .post('/v1/containers')
      .send({
        name: '上海河马眼镜有限公司',
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('delete /v1/containers/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/containers/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})

