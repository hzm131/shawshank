const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const storeList = []
  const organizationId = await knex('organizations').count('id')

  for (let i = 0; i < organizationId[0].count; i++) {
    storeList.push(genPurchasers(storeList,organizationId[0].count,i))
  }

  await knex('stores').truncate()
  await knex('stores').insert(storeList)
}


function genPurchasers(storeList,count,i) {
  let organization_id
  let findOrganization

  organization_id = Math.floor(rng() * count) + 1
  findOrganization = _.findIndex(storeList, {
    organization_id
  })
  while (findOrganization !== -1) {
    organization_id = Math.floor(rng() * count) + 1
    findOrganization = _.findIndex(storeList, {
      organization_id
    })
  }
  const created_at = faker.date.past()
  return {
    organization_id,
    name:'门店'+ i,
    address:'门店地址'+i,
    phone_number:genMobile(),
    created_at,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

function genMobile() {
  const prefixs = [
    '130',
    '131',
    '132',
    '133',
    '134',
    '135',
    '136',
    '137',
    '138',
    '139',
    '147',
    '150',
    '151',
    '152',
    '153',
    '155',
    '156',
    '157',
    '158',
    '159',
    '186',
    '187',
    '188',
    '189'
  ]

  let mobile = prefixs[Math.floor(prefixs.length * rng())]

  for (var j = 0; j < 8; j++) {
    mobile = mobile + Math.floor(rng() * 10)
  }

  return mobile
}

module.exports = main

if (require.main === module) {
  main()
}
