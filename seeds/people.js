const { knex } = require('../services/db')
const _ = require('lodash')
const pinyin = require('pinyin')
const seedrandom = require('seedrandom')
const format = require('date-fns/format')
const idPrefixs = _.keys(require('./data/id_prefixs.json'))

const faker = require('faker/locale/zh_CN')
faker.seed(1)
const rng = seedrandom('1')

const jobs = ['老师', '学生', '医生', '白领', '程序员', '工程师', '作家']
const educations = [
  '小学',
  '初中',
  '高中',
  '专科',
  '本科',
  '硕士研究生',
  '博士研究生'
]

const emailSuffixes = [
  '@gmail.com',
  '@yahoo.com',
  '@msn.com',
  '@hotmail.com',
  '@aol.com',
  '@ask.com',
  '@live.com',
  '@qq.com',
  '@0355.net',
  '@163.com',
  '@163.net',
  '@263.net',
  '@3721.net',
  '@yeah.net',
  '@googlemail.com',
  '@mail.com',

  // 国外常用邮箱：
  '@hotmail.com',
  '@msn.com',
  '@yahoo.com',
  '@gmail.com',
  '@aim.com',
  '@aol.com',
  '@mail.com',
  '@walla.com',
  '@inbox.com',
  //国内常见邮箱：
  //
  '@126.com',
  '@163.com',
  '@sina.com',
  '@21cn.com',
  '@sohu.com',
  '@yahoo.com.cn',
  '@tom.com',
  '@qq.com',
  '@etang.com',
  '@eyou.com',
  '@56.com',
  '@x.cn',
  '@chinaren.com',
  '@sogou.com',
  '@citiz.com'
]

async function main() {
  const people = []

  for (let i = 0; i < 400; i++) {
    people.push(genPerson())
  }

  await knex('people').truncate()
  await knex('people').insert(people)
}

module.exports = main

if (require.main === module) {
  main()
}
////////////////////////////////
/**
 * 生成一个person
 */
function genPerson() {
  const person = {
    name: faker.fake('{{name.lastName}}{{name.firstName}}'),
    email: faker.fake('{{internet.email}}'),
    sex: faker.random.number() % 2,
    job: jobs[faker.random.number() % jobs.length],
    birthday: faker.date.past(Math.floor(100 * rng())),
    mobile: genMobile(),
    educational_background: educations[Math.floor(educations.length * rng())],
    created_at: faker.date.past()
  }

  return {
    ...person,
    email:
      pinyin(person.name, {
        style: pinyin.STYLE_FIRST_LETTER
      }).join('') +
      Math.floor(10000 * rng()) +
      emailSuffixes[Math.floor(emailSuffixes.length * rng())],
    abbreviation: pinyin(person.name, {
      style: pinyin.STYLE_FIRST_LETTER
    }).join(''),
    birthday_infer: person.birthday,
    identification_number: genID(
      format(person.birthday, 'YYYYMMDD'),
      person.sex
    ),
    updated_at:
      rng() < 0.5 ? faker.date.between(person.created_at, new Date()) : person.created_at
  }
}

/**
 * 生成手机号码
 */
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

/**
 * 生成身份证号
 * sex: 0男 1女
 */
function genID(birthday, sex) {
  const coefficientArray = [
    '7',
    '9',
    '10',
    '5',
    '8',
    '4',
    '2',
    '1',
    '6',
    '3',
    '7',
    '9',
    '10',
    '5',
    '8',
    '4',
    '2'
  ] // 加权因子
  const lastNumberArray = [
    '1',
    '0',
    'X',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2'
  ] // 校验码
  const address = idPrefixs[Math.floor(idPrefixs.length * rng())] // 住址
  const s =
    Math.floor(rng() * 10).toString() +
    Math.floor(rng() * 10).toString() +
    (sex === 0 ? genMalePos() : genFemalePos())
  const array = (address + birthday + s).split('')
  let total = 0
  for (let i = 0; i < array.length; i++) {
    total = total + parseInt(array[i]) * parseInt(coefficientArray[i])
  }
  const lastNumber = lastNumberArray[parseInt(total % 11)]

  return address + birthday + s + lastNumber
}

/**
 * 生成10以内的奇数
 */
function genMalePos() {
  const rand = Math.floor(5 * rng())

  return rand * 2 + 1
}

/**
 * 生成10以内的偶数
 */
function genFemalePos() {
  const rand = Math.floor(5 * rng())

  return rand * 2
}
