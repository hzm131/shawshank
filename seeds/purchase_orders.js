const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const uuidv4 = require('uuid/v4')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const purchaseOrders = []

  const purchasersCount = await knex('purchasers').count('id')
  const suppliersCount = await knex('suppliers').count('id')

  for (let i = 0; i < 20; i++) {
    purchaseOrders.push(
      genPurchaseOrders(
        purchaseOrders,
        purchasersCount[0].count,
        suppliersCount[0].count
      )
    )
  }

  await knex('purchase_orders').truncate()
  await knex('purchase_orders').insert(purchaseOrders)
}

function genPurchaseOrders(purchaseOrders, purchasersCount, suppliersCount) {
  let supplierId
  let purchaserId
  let findSupplier
  let findPurchaser

  supplierId = Math.floor(rng() * suppliersCount) + 1
  findSupplier = _.findIndex(purchaseOrders, {
    supplier_id: supplierId
  })
  while (findSupplier !== -1) {
    supplierId = Math.floor(rng() * suppliersCount) + 1
    findSupplier = _.findIndex(purchaseOrders, {
      supplier_id: supplierId
    })
  }

  purchaserId = Math.floor(rng() * purchasersCount) + 1
  findPurchaser = _.findIndex(purchaseOrders, {
    purchaser_id: purchaserId
  })
  while (findPurchaser !== -1) {
    purchaserId = Math.floor(rng() * purchasersCount) + 1
    findPurchaser = _.findIndex(purchaseOrders, {
      purchaser_id: purchaserId
    })
  }

  const created_at = faker.date.past()

  return {
    created_at: created_at,
    uuid: uuidv4(),
    supplier_id: supplierId,
    purchased_at: faker.date.past(),
    purchaser_id: purchaserId,
    editable: booleanNum(),
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

//是否可编辑
function booleanNum() {
  const num = ['0', '1']
  return Math.floor(rng() * num.length)
}

module.exports = main

if (require.main === module) {
  main()
}
