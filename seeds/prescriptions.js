const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const prescriptionList = []
  const Optometrist = await knex('optometrists').count('id')
  for (let i = 0; i < Optometrist[0].count; i++) {
    prescriptionList.push(genPrescription(prescriptionList,Optometrist[0].count))
  }

  await knex('prescriptions').truncate()
  await knex('prescriptions').insert(prescriptionList)
}




function genPrescription(prescriptionList,count) {
  let optometrist_id
  let findPreson

  optometrist_id = Math.floor(rng() * count) + 1
  findPreson = _.findIndex(prescriptionList, {
    optometrist_id
  })

  while (findPreson !== -1) {
    optometrist_id = Math.floor(rng() * count) + 1
    findPreson = _.findIndex(prescriptionList, {
      optometrist_id
    })
  }

  const arr0 = [0,1]
  const arr = [0,1,2,3,-1]
  const arr1 = [0,12]
  const numArr0 =  Math.floor(rng()*arr0.length)
  const numArr = Math.floor(rng()*arr.length)
  const created_at = faker.date.past()
  return {
    optometrist_id,
    use_for: arr0[numArr0], //integer - 用途 远用：0 近用：1
    vertex_distance: arr1[Math.floor(rng()*arr1.length)], // integer - 镜眼距、顶点距、镜角距VD 一般眼镜12mm角膜接触0mm
    right_sphere:1,  // integer - 右眼球镜度SPH
    left_sphere:1, //integer - 左眼球镜度SPH
    right_cylinder:1, //integer - 右眼柱镜度CYL
    left_cylinder:1, //integer - 左眼柱镜度CYL
    right_cylinder_axis:1, //integer - 右眼柱镜轴位Axis
    left_cylinder_axis:1, //integer - 左眼柱镜轴位Axis
    right_corrected_vision:1, //number - 右眼矫正视力V
    left_corrected_vision:1, //number - 左眼矫正视力V
    right_papillary_distance:1, //integer - 右眼瞳距
    left_papillary_distance:1, //integer - 左眼瞳距
    right_add:1, //integer - 右眼下加光
    left_add:1, //integer - 左眼下加光
    right_prism:1, //integer - 右眼棱镜度
    right_prism_base:arr[numArr], //integer - 右眼棱镜度基底 上：0 右：1 下：2 左：3 无数据: -1
    left_prism:1,  //integer - 左眼棱镜度
    left_prism_base:arr[numArr], //integer - 左眼棱镜度基底 上：0 右：1 下：2 左：3 无数据：-1
    expires_at:created_at,  //date-time - 验光度数过期时间，由验光师评估当前用户的度数需多久复测
    created_at,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
