const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const assemblerList = []
  const personId = await knex('people').count('id')

  for (let i = 0; i < personId[0].count; i++) {
    assemblerList.push(genAssembler(assemblerList,personId[0].count))
  }

  await knex('assemblers').truncate()
  await knex('assemblers').insert(assemblerList)
}




function genAssembler(assemblerList,count) {
  let person_id
  let findPreson

  person_id = Math.floor(rng() * count) + 1
  findPreson = _.findIndex(assemblerList, {
    person_id
  })

  while (findPreson !== -1) {
    person_id = Math.floor(rng() * count) + 1
    findPreson = _.findIndex(assemblerList, {
      person_id
    })
  }
  const created_at = faker.date.past()
  return {
    person_id,
    created_at,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
