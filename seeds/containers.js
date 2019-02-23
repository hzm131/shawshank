const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
//const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const containers = []

  for (let i = 0; i < 30; i++) {
    containers.push(genContainer(i))
  }

  await knex('containers').truncate()
  await knex('containers').insert(containers)
}




function genContainer(i) {

  const created_at = faker.date.past()
  return {
    created_at,
    name: '货柜'+i,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
