const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let token
beforeAll(async () => {
  token = await authHelper.login()

  const org = await model.Person.forge({
    name: '张三三',
    abbreviation: 'ZSS'
  }).save()

  await model.Purchaser.forge({
    person_id: org.id
  }).save()
})

afterAll(async () => {
  await Promise.all([
    utilHelper.cleanTable('purchasers'),
    utilHelper.cleanTable('people')
  ])
})

describe('router/purchasers', () => {
  it('get /v1/purchasers - abbreviation like xx*', async () => {
    const res = await request(app.listen())
      .get('/v1/purchasers?limit=10&offset=0&person.abbreviation~like=ZS*')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(1)
  })

  it('get /v1/purchasers - name like xx*', async () => {
    const res = await request(app.listen())
      .get(
        `/v1/purchasers?limit=10&offset=0&person.name~like=${encodeURIComponent(
          '张三*'
        )}`
      )
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(1)
  })
})
