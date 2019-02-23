const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let person
let token
beforeAll(async () => {
  token = await authHelper.login()

  person = await model.Person.forge({
    name : '我',
    abbreviation: 'wo',
    email: '891453178@qq.com',
    sex: 0,
    job: '战士',
    birthday: '1999-12-12',
    birthday_infer: '1999-12-12',
    identification_number: '23123432423423',
    educational_background: '大师',
  }).save()

})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('people'),
  ])
})

describe('router/people', () => {
  it('get /v1/people', async () => {
    const res = await request(app.listen())
      .get('/v1/people?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/people/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/people/${person.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/people', async () => {
    const res = await request(app.listen())
      .post('/v1/people')
      .send({
        name : 'wang',
        abbreviation: 'wang',
        email: '893453178@qq.com',
        sex: 0,
        job: '战士',
        birthday: '1999-12-12',
        birthday_infer: '1999-12-12',
        identification_number: '342623199511233278',
        educational_background: '十大',
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('put /v1/people/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/people/${person.id}`)
      .send({
        name : 'wang',
        abbreviation: 'wang',
        email: '893453178@qq.com',
        sex: 0,
        job: '战士',
        birthday: '1999-12-12',
        birthday_infer: '1999-12-12',
        identification_number: '342623199511233278',
        educational_background: '十大',
      })
      .set('Authorization', `Bearer ${token.access_token}`)



    expect(res.status).toBe(200)
  })
})