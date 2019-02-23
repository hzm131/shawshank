const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const ordersList = []

  const customerId = await knex('customers').count('id')
  const assemblerId = await knex('assemblers').count('id')
  const prescriptionId = await knex('prescriptions').count('id')
  const storeId = await knex('stores').count('id')

  console.log( customerId,assemblerId,prescriptionId,storeId)
  await knex('salesmen').count('id')

  for (let i = 0; i < 30; i++) {
    ordersList.push(genOrders(ordersList,customerId[0].count,assemblerId[0].count,prescriptionId[0].count,storeId[0].count))
  }

  await knex('orders').truncate()
  await knex('orders').insert(ordersList)
}




function genOrders(ordersList,customerId,assemblerId,prescriptionId,storeId) {
  let customer_id
  let findCoustomer

  customer_id = Math.floor(rng() * customerId) + 1
  findCoustomer = _.findIndex(ordersList, {
    customer_id
  })

  while (findCoustomer !== -1) {
    customer_id = Math.floor(rng() * customerId) + 1
    findCoustomer = _.findIndex(ordersList, {
      customer_id
    })
  }

  let assembler_id
  let findassembler

  assembler_id = Math.floor(rng() * assemblerId) + 1
  findassembler = _.findIndex(ordersList, {
    assembler_id
  })

  while (findassembler !== -1) {
    assembler_id = Math.floor(rng() * assemblerId) + 1
    findassembler = _.findIndex(ordersList, {
      assembler_id
    })
  }


  let prescription_id
  let findPrescription

  prescription_id = Math.floor(rng() * prescriptionId) + 1
  findPrescription = _.findIndex(ordersList, {
    prescription_id
  })

  while (findPrescription !== -1) {
    prescription_id = Math.floor(rng() * prescriptionId) + 1
    findPrescription = _.findIndex(ordersList, {
      prescription_id
    })
  }

  let store_id
  let findStore

  store_id = Math.floor(rng() * storeId) + 1
  findStore = _.findIndex(ordersList, {
    store_id
  })

  while (findStore !== -1) {
    store_id = Math.floor(rng() * storeId) + 1
    findStore = _.findIndex(ordersList, {
      store_id
    })
  }


  const created_at = faker.date.past()
  const num = Math.floor(rng()*1000)

  const arr = [1,2,3]
  return {
    store_id:store_id,
    salesman_id:arr[ Math.floor(rng()*arr.length)],
    customer_id:customer_id,
    assembler_id:assembler_id,
    prescription_id:prescription_id,
    total_price:num,
    note:`备注${num}`,
    temp_product_items:`临时产品列表${num}`, //临时产品列表
    created_at,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
