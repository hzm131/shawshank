const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const uuidv4 = require('uuid/v4')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const PackageList = []

  const containerId = await knex('containers').count('id')

  for (let i = 0; i < 200; i++) {
    PackageList.push(
      genPackage(PackageList,containerId[0].count))
  }

  await knex('packages').truncate()
  await knex('packages').insert(PackageList)
}

function genPackage(PackageList,count) {
  let containers
  let findPackage


  containers = Math.floor(rng() * count) + 1
  findPackage = _.findIndex(PackageList, {
    supplier_id: containers
  })
  while (findPackage !== -1) {
    containers = Math.floor(rng() * count) + 1
    findPackage = _.findIndex(PackageList, {
      supplier_id: containers
    })
  }


  const created_at = faker.date.past()

  return {
    created_at: created_at,
    uuid: uuidv4(),
    container_id: containers,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
