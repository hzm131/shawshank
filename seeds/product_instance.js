const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const uuidv4 = require('uuid/v4')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const productInstanceList = []

  const productId = await knex('products').count('id')
  const packageId= await knex('packages').count('id')
  for (let i = 0; i < 200; i++) {
    productInstanceList.push(
      genProductInstance(productInstanceList,productId[0].count,packageId[0].count))
  }

  await knex('product_instances').truncate()
  await knex('product_instances').insert(productInstanceList)
}

function genProductInstance(productInstanceList,productId,packageId) {
  let productListId
  let findProduct
  let packagetListId
  let findpackage

  productListId = Math.floor(rng() * productId) + 1
  findProduct = _.findIndex(productInstanceList, {
    product_id: productListId
  })
  while (findProduct !== -1) {
    productListId = Math.floor(rng() * productId) + 1
    findProduct = _.findIndex(productInstanceList, {
      product_id: productListId
    })
  }



  packagetListId = Math.floor(rng() * packageId) + 1
  findpackage = _.findIndex(productInstanceList, {
    package_id: packagetListId
  })
  while (findpackage !== -1) {
    packagetListId = Math.floor(rng() * packageId) + 1
    findpackage = _.findIndex(productInstanceList, {
      package_id: packagetListId
    })
  }

  const created_at = faker.date.past()

  return {
    created_at: created_at,
    uuid: uuidv4(),
    package_id: packagetListId,
    product_id:productListId,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
