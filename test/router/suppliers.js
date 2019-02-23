const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const model = require('../../model')
const utilHelper = require('../helpers/util')

let token
beforeAll(async () => {
  token = await authHelper.login()

  const org = await model.Organization.forge({
    name: '测试机构',
    abbreviation: 'CSJG'
  }).save()

  await model.Supplier.forge({
    organization_id: org.id
  }).save()
})

afterAll(async () => {
  await utilHelper.cleanTable('suppliers')
})

describe('router/suppliers', () => {
  it('get /v1/suppliers - abbreviation like xx*', async () => {
    const res = await request(app.listen())
      .get('/v1/suppliers?limit=10&offset=0&organization.abbreviation~like=CS*')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/suppliers - name like xx*', async () => {
    const res = await request(app.listen())
      .get(
        `/v1/suppliers?limit=10&offset=0&organization.name~like=${encodeURIComponent(
          '测*'
        )}`
      )
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})
