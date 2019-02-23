const { knex } = require('../services/db')
const crypto = require('crypto')

function sha256(str) {
  return crypto
    .createHash('sha256')
    .update(str)
    .digest('hex')
}

async function main() {
  await knex('users').truncate()
  await knex('users').insert([
    {
      id: 1,
      username: '18616251325',
      password: sha256('123456'),
      person_id: 1,
      created_at: '2018-06-06 06:06:06',
      updated_at: '2018-06-06 06:06:06'
    }
  ])
}

module.exports = main

if (require.main === module) {
  main()
}
