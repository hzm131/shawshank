const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

// eslint-disable-next-line
let prescription
let token
beforeAll(async () => {
  token = await authHelper.login()

  prescription = await model.Prescription.forge({
    optometrist_id:1,
    use_for: 0,
    vertex_distance: 12,
    right_sphere: -200,
    left_sphere: -225,
    right_cylinder: -50,
    left_cylinder: -75,
    right_cylinder_axis: 180,
    left_cylinder_axis: 160,
    right_corrected_vision: 5.0,
    left_corrected_vision: 5.0,
    right_papillary_distance: 32,
    left_papillary_distance: 32,
    right_add: 0,
    left_add: 0,
    right_prism: 0,
    right_prism_base: -1,
    left_prism: 0,
    left_prism_base: -1,
    expires_at: '2018-08-06T06:06:06Z'
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('prescriptions'),
  ])
})

describe('router/prescriptions', () => {
  it('get /v1/prescriptions', async () => {
    const res = await request(app.listen())
      .get('/v1/prescriptions?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v1/prescriptions/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/prescriptions/${prescription.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('post /v1/prescriptions', async () => {
    const res = await request(app.listen())
      .post('/v1/prescriptions')
      .send({
        optometrist_id:1,
        use_for: 0,
        vertex_distance: 12,
        right_sphere: -200,
        left_sphere: -225,
        right_cylinder: -50,
        left_cylinder: -75,
        right_cylinder_axis: 180,
        left_cylinder_axis: 160,
        right_corrected_vision: 5,
        left_corrected_vision: 5,
        right_papillary_distance: 32,
        left_papillary_distance: 32,
        right_add: 0,
        left_add: 0,
        right_prism: 0,
        right_prism_base: -1,
        left_prism: 0,
        left_prism_base: -1,
        expires_at: '2018-08-06T06:06:06Z'
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('put /v1/prescriptions/:id', async () => {
    const res = await request(app.listen())
      .put(`/v1/prescriptions/${prescription.id}`)
      .send({
        optometrist_id:1,
        use_for: 1,
        vertex_distance: 13,
        right_sphere: -120,
        left_sphere: -225,
        right_cylinder: -50,
        left_cylinder: -75,
        right_cylinder_axis: 180,
        left_cylinder_axis: 160,
        right_corrected_vision: 5,
        left_corrected_vision: 5,
        right_papillary_distance: 32,
        left_papillary_distance: 32,
        right_add: 0,
        left_add: 0,
        right_prism: 0,
        right_prism_base: -1,
        left_prism: 0,
        left_prism_base: -1,
        expires_at: '2018-08-06T06:06:06Z'
      })
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})
