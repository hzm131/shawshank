const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const purchasers = []

  const peopleCount = await knex('people').count('id')

  for (let i = 0; i < 100; i++) {
    purchasers.push(genPurchasers(purchasers, peopleCount[0].count))
  }

  await knex('purchasers').truncate()
  await knex('purchasers').insert(purchasers)
}

function genPurchasers(purchasers, count) {
  let purchasersId
  let findResult

  purchasersId = Math.floor(rng() * count) + 1
  findResult = _.findIndex(purchasers, {
    person_id: purchasersId
  })

  while (findResult !== -1) {
    purchasersId = Math.floor(rng() * count) + 1
    findResult = _.findIndex(purchasers, {
      person_id: purchasersId
    })
  }
  const created_at = faker.date.past()

  return {
    created_at,
    person_id: purchasersId,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
