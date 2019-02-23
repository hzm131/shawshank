const router = require('koa-router')()
const pProps = require('p-props')
const _ = require('lodash')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)

const getRawBody = require('raw-body')
const contentType = require('content-type')

const oss = require('../services/oss')
const format = require('date-fns/format')
const uuidV4 = require('uuid/v4')
const fileType = require('file-type')
const formidable = require('formidable')

/**
@oas-path
/v1/images/upload:
  post:
    summary: 上传图片
    security: [{ token: [] }]
    tags:
      - Images
    requestBody:
      content:
        image/*:    # Can be image/png, image/svg, image/gif, etc.
          schema:
            type: string
            format: binary
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: 文件名称
                url:
                  type: string
                  description: 文件下载URL
*/
router.post('/v1/images/upload', async ctx => {
  await ctx.ensureLogin()

  const file = await getRawBody(ctx.req, {
    length: ctx.req.headers['content-length'],
    limit: '20mb',
    encoding: contentType.parse(ctx.req).parameters.charset
  })

  const info = await uploadFile(file)

  ctx.body = info
})

async function uploadFile(file) {
  const fileInfo = fileType(file)

  if (!fileInfo || !/^image\/.+$/.test(fileInfo.mime)) {
    return Promise.reject({ code: 403005 }) // 上传的文件类型不合法，请检查上传文件是否为jpg/jpeg/png/gif等图片格式
  }

  const filename = `${format(new Date(), 'YYYY/MMDD')}/${uuidV4()}.${
    fileInfo.ext
  }`

  const result = await oss.put(filename, file, {
    mime: fileInfo.mime
  })

  return {
    name: result.name,
    url: oss.query.cdn_url + '/' + result.name
  }
}

/**
@oas-path
/v1/images/form_upload:
  post:
    summary: 上传图片
    security: [{ token: [] }]
    tags:
      - Images
    requestBody:
      content:
        multipart/form-data:
          schema:
            type: object
            properties:
              profileImage:
                type: string
                format: binary
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: 文件名称
                url:
                  type: string
                  description: 文件下载URL
*/
router.post('/v1/images/form_upload', async ctx => {
  await ctx.ensureLogin()

  const form = new formidable.IncomingForm()
  const { files } = await new Promise((resolve, reject) => {
    form.parse(ctx.req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      resolve({
        fields,
        files
      })
    })
  })

  const result = await pProps(
    _.mapValues(files, async v => {
      const buffer = await readFile(v.path)
      return uploadFile(buffer)
    })
  )

  ctx.body = result
})

module.exports = router
