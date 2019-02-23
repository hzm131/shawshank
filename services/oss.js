const AliOSS = require('ali-oss')
const querystring = require('querystring')

const url = require('url')
const { OSS } = process.env

if (!OSS) {
  throw new Error('缺少环境变量OSS')
}

const ossUrl = url.parse(OSS)
const [keyId, keySecret] = ossUrl.auth.split(':')
const query = querystring.parse(ossUrl.query)

const config = {
  region: ossUrl.host,
  accessKeyId: keyId,
  accessKeySecret: keySecret,
  bucket: ossUrl.pathname.replace(/^\//, '')
}

const client = new AliOSS(config)
client.query = query

module.exports = client
