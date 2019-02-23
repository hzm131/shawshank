const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const stream = require('stream')
const mime = require('mime-types')

let token
beforeAll(async () => {
  token = await authHelper.login()
})

describe('router/images', () => {
  it('post /v1/images/upload', async () => {
    const imageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=',
      'base64'
    )
    const bufferStream = new stream.PassThrough()
    bufferStream.end(imageBuffer)

    const res = await request(app.listen())
      .post('/v1/images/upload')
      .set('Content-Type', mime.contentType('.png'))
      .send(imageBuffer)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.name).toMatch(
      /^\d{4}\/\d{4}\/.{8}-.{4}-.{4}-.{4}-.{12}.png/
    )
  })

  it('post /v1/images/upload - filetype not in jpg/jpeg/png/gif', async () => {
    const imageBuffer = Buffer.from('XXX')
    const bufferStream = new stream.PassThrough()
    bufferStream.end(imageBuffer)

    const res = await request(app.listen())
      .post('/v1/images/upload')
      .set('Content-Type', mime.contentType('.png'))
      .send(imageBuffer)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(403005)
  })

  it('post /v1/images/upload - filetype is pdf', async () => {
    const imageBuffer = Buffer.from('JVBERi0xLjEK', 'base64')
    const bufferStream = new stream.PassThrough()
    bufferStream.end(imageBuffer)

    const res = await request(app.listen())
      .post('/v1/images/upload')
      .set('Content-Type', mime.contentType('.png'))
      .send(imageBuffer)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(403005)
  })

  it('post /v1/images/form_upload', async () => {
    const imageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=',
      'base64'
    )
    const bufferStream = new stream.PassThrough()
    bufferStream.end(imageBuffer)

    const res = await request(app.listen())
      .post('/v1/images/form_upload')
      .attach('file', imageBuffer, 'file.png')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })
})
