const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const rng = seedrandom('1')
faker.seed(1)

const RandomSelect = rng => arr => arr[Math.floor(rng() * arr.length)]
const randomSelect = RandomSelect(rng)

//生成公司详细名
const companyPrefixes = [
  '黑龙江',
  '吉林',
  '辽宁',
  '江苏',
  '山东',
  '安徽',
  '河北',
  '河南',
  '湖北',
  '湖南',
  '江西',
  '陕西',
  '山西',
  '四川',
  '青海',
  '海南',
  '广东',
  '贵州',
  '浙江',
  '福建',
  '台湾',
  '甘肃',
  '云南',
  '内蒙古',
  '宁夏',
  '新疆',
  '西藏',
  '广西',
  '北京',
  '上海',
  '天津',
  '重庆'
]

const suffix = [
  '贸易',
  '眼镜',
  '光学',
  '广告',
  '文化传媒',
  '自动化技术',
  '投资管理'
]
const industry = ['有限公司', '股份公司']

async function main() {
  const organizations = []

  for (let i = 0; i < 100; i++) {
    organizations.push(genOrganization())
  }

  await knex('organizations').truncate()
  await knex('organizations').insert(organizations)
}

function genOrganization() {
  const created_at = faker.date.past()
  const abbreviation = faker.fake('{{name.lastName}}') + randomSelect(suffix)

  return {
    name: randomSelect(companyPrefixes) + abbreviation + randomSelect(industry),
    abbreviation,
    //address:,
    zip_code: faker.address.zipCode(),
    phone_number: faker.phone.phoneNumber(),
    credit_code: credit(),
    created_at,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

//统一社会信用码
const number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const letter = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'G',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'T',
  'U',
  'W',
  'X',
  'Y'
]

function credit() {
  let str = '',
    num_con = ''
  for (let i = 0; i < 8; i++) {
    str += number[Math.floor(number.length * rng())]
  }
  let concat = number.concat(letter)
  for (let i = 0; i < 10; i++) {
    num_con += concat[Math.floor(concat.length * rng())]
  }
  return str + num_con
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch()
}

module.exports = main
