const bluebird = require('bluebird')
const redis = require('redis')

/**
 * REDIS_URL
 */
const REDIS_URL = process.env.REDIS
if (!REDIS_URL) {
  throw new Error('找不到REDIS，请检查环境变量是否设置了REDIS')
}

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const client = redis.createClient(REDIS_URL)

process.on('exit', () => {
  client.quit()
})

module.exports = client
