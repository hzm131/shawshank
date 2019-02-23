const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const suppliers = []

  const organizationCount = await knex('organizations').count('id') //根据organizations中的id数生成随机数

  for (let i = 0; i < 30; i++) {
    suppliers.push(genSupplier(suppliers, organizationCount[0].count))
  }

  await knex('suppliers').truncate()
  await knex('suppliers').insert(suppliers)
}

function genSupplier(suppliers, count) {
  let generatedOrgId
  let findResult

  generatedOrgId = Math.floor(rng() * count) + 1
  findResult = _.findIndex(suppliers, {
    organization_id: generatedOrgId //返回-1 说明数组中没有这条数据  查询suppliers中organization_id属性值有没有重复
  })

  while (findResult !== -1) {
    //上面返回-1 不遵循条件 所以不走下面循环
    generatedOrgId = Math.floor(rng() * count) + 1 //如果返回不是-1 遵循条件 执行循环 新生成一个随机数
    findResult = _.findIndex(suppliers, {
      organization_id: generatedOrgId //再查找suppliers数组中是否有这一项 如果没有返回-1 将generatedOrgId赋值给organization_id，
      // 如果有返回索引，findResult !== -1 条件成立，再次执行循环
    })
  }

  const created_at = faker.date.past()
  return {
    created_at,
    organization_id: generatedOrgId,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
