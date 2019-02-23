const request = require('supertest')

const app = require('../../app')

describe('router/index', () => {
  it('get /oas.yaml', async () => {

    const res = await request(app.listen())
      .get('/oas.yaml')

    expect(res.status).toBe(200)
  })

  it('get /health_check', async () => {

    const res = await request(app.listen())
      .get('/health_check')

    expect(res.status).toBe(200)
  })
})
