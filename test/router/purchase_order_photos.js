const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

// eslint-disable-next-line
let pg
let token
beforeAll(async () => {
  token = await authHelper.login()

  pg = await model.PurchaseOrderPhoto.forge({
    purchase_order_id: 1,
    uuid: 'ba00c8d5-5467-42a1-9a0f-d42a6698694c',
    photo_url: '/ss/ss/ss'
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('purchase_order_photos'),
  ])
})

describe('router/purchase_order_photos', () => {

  it('post /v1/purchase_order_photos', async () => {
    const res = await request(app.listen())
      .post('/v1/purchase_order_photos')
      .send({
        purchase_order_id: 1,
        uuid: 'ba00c8d5-5467-42a1-9a0f-d42a6698694c',
        photo_url: 'https://nvie.com/img/git-model@2x.png'
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/purchase_order_photos/actions/count', async () => {
    const res = await request(app.listen())
      .get('/v1/purchase_order_photos/actions/count?where_uuid_eq=c34efcd4-e1b9-4ae4-8f87-c34efcd4c574')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(0)
  })
})
