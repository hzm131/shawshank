const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let org
let token
beforeAll(async () => {
  token = await authHelper.login()

  org = await model.Organization.forge({
    name: '上海河马眼镜有限公司',
    abbreviation: '河马眼镜',
    address: '上海市杨浦区政学路77号',
    zip_code: '200000',
    phone_number: '18616251325',
    credit_code: '91310113MA1GMTCB98'
  }).save()


})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('organizations'),
    utilHelper.cleanTable('operation_records')
  ])
})

describe('router/organizations', () => {
  it('get /v1/organizations', async () => {
    const res = await request(app.listen())
      .get('/v1/organizations?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/organizations', async () => {
    const res = await request(app.listen())
      .post('/v1/organizations')
      .send({
        name: '上海河马眼镜有限公司',
        abbreviation: '河马眼镜',
        address: '上海市杨浦区政学路77号',
        zip_code: '200000',
        phone_number: '18616251325',
        credit_code: '91310113MA1GMTCB98'
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/organizations/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/organizations/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('put /v1/organizations/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/organizations/${org.id}`)
      .send({
        name: '上海河马眼镜有限公司',
        abbreviation: '河马眼镜',
        address: '上海市杨浦区政学路77号',
        zip_code: '200001',
        phone_number: '18616251325',
        credit_code: '91310113MA1GMTCB98'
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('delete /v1/organizations/:id', async () => {
    const res = await request(app.listen())
      .delete(`/v1/organizations/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})
