const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const _ = require('lodash')
const rng = seedrandom('1')
const uuidv4 = require('uuid/v4')
faker.seed(1)

async function main() {
  const priceTagList = []
  const productInstanceId = await knex('product_instances').count('id')

  for (let i = 0; i < productInstanceId[0].count; i++) {
    priceTagList.push(genPriceTag(priceTagList,productInstanceId[0].count))
  }

  await knex('price_tags').truncate()
  await knex('price_tags').insert(priceTagList)
}




function genPriceTag(priceTagList,count) {
  let product_instance_id
  let findproductinstance

  product_instance_id = Math.floor(rng() * count) + 1
  findproductinstance = _.findIndex(priceTagList, {
    product_instance_id
  })

  while (findproductinstance !== -1) {
    product_instance_id = Math.floor(rng() * count) + 1
    findproductinstance = _.findIndex(priceTagList, {
      product_instance_id
    })
  }

  const price = [111,222,333,444,555,666,777,888,999,123,234,345,456,678,789]

  const created_at = faker.date.past()
  return {
    product_instance_id,
    uuid:uuidv4(),
    price:price[Math.floor(rng() * price.length)],
    created_at,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
