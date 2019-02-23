const { knex } = require('../services/db')
const pinyin = require('pinyin')
const seedrandom = require('seedrandom')

const faker = require('faker/locale/zh_CN')
faker.seed(1)
const rng = seedrandom('1')

const RandomSelect = rng => arr => arr[Math.floor(rng() * arr.length)]

const randomSelect = RandomSelect(rng)

/**
 * 框架眼镜品牌
 */
const frameBrands = [
  '精工',
  '暴龙',
  '雷朋',
  '派丽蒙',
  '帕莎',
  '宝姿',
  '明月',
  '鳄鱼',
  '李维斯',
  '阿玛尼',
  '巴宝莉'
]

/**
 * 镜片品牌
 */
const lensBrands = ['依视路', '蔡司', '豪雅', '精工', '凯米', '罗敦司得']

/**
 * 镜片材质
 */
const lensMaterials = ['玻璃', '树脂', '太空']

/**
 * 镜片类型
 */
const lensTypes = ['球面', '非球面']

/**
 * 折射率
 */
const lensRefractiveIndexs = ['1.499', '1.553', '1.60', '1.67', '1.737']

/**
 * 款式
 */
const types = ['设计款', '复古款', '潮流款', '经典款']

/**
 * 材质
 */
const materials = [
  '金属',
  '弹力钢',
  '铝镁',
  '板材',
  'TR',
  'β钛',
  '混合材质',
  '超薄板材',
  '超薄板材/钛',
  '钛金属'
]

/**
 * 形状
 */
const shapes = [
  '圆形',
  '方形',
  '蝶形',
  'D形',
  '蛤蟆镜',
  '猫眼',
  '多边形',
  '矩形'
]

/**
 * 框架眼镜款式
 */
const gender = ['男士', '女士']

/**
 * 隐形眼镜品牌
 */
const contactLensBrands = ['博士伦', '强生', '海昌', '卫康', '海俪恩', '蔡司']

/**
 * 隐形眼镜类型
 */
const contactLensType = ['日抛', '月抛', '双周抛', '半年抛', '年戴型', '季抛']

/**
 * 隐形眼镜护理液类型
 */
const contactLensSolutionTypes = [
  '促销装',
  '中瓶装(≥250ML)',
  '小瓶装(≤240ML)',
  '大瓶装(500ML)'
]

/**
 * 老花镜品牌
 */
const readingGlassesBrands = ['夕阳红', '艾森诺', '老爷子', '老人100', '年轻态']

/**
 * 老花镜材质
 */
const readingGlassesMaterials = ['板材', '金属', '水晶']

/**
 * 美瞳颜色
 */
const colors = ['黑色', '棕色', '灰色', '蓝色', '紫色', '粉色', '绿色']

async function main() {
  const products = []

  for (let i = 0; i < 500; i++) {
    products.push(genProducts())
  }

  await knex('products').truncate()
  await knex('products').insert(products)
}

module.exports = main

if (require.main === module) {
  main().then(() => process.exit(0))
}

function genProducts() {
  const type = Math.floor(8 * rng())
  const created_at = faker.date.past()
  let name = ''

  if (type === 0) {
    // 其他
    name = '其他产品'
  } else if (type === 1) {
    // 太阳镜
    name =
      randomSelect(frameBrands) +
      randomSelect(gender) +
      randomSelect(materials) +
      randomSelect(colors) +
      randomSelect(shapes) +
      randomSelect(types) +
      '太阳镜'
  } else if (type === 2) {
    // 镜框
    name =
      randomSelect(frameBrands) +
      randomSelect(gender) +
      randomSelect(materials) +
      randomSelect(colors) +
      randomSelect(shapes) +
      randomSelect(types) +
      '镜框'
  } else if (type === 3) {
    // 镜片
    name =
      randomSelect(lensBrands) +
      randomSelect(lensRefractiveIndexs) +
      randomSelect(lensTypes) +
      randomSelect(lensMaterials) +
      '镜片'
  } else if (type === 4) {
    // 美瞳
    name =
      randomSelect(contactLensBrands) +
      randomSelect(contactLensType) +
      randomSelect(colors) +
      '美瞳'
  } else if (type === 5) {
    // 隐形眼镜
    name =
      randomSelect(contactLensBrands) +
      randomSelect(contactLensType) +
      '隐形眼镜'
  } else if (type === 6) {
    // 护理液
    name =
      randomSelect(contactLensBrands) +
      randomSelect(contactLensSolutionTypes) +
      '护理液'
  } else if (type === 7) {
    // 老花镜
    name =
      randomSelect(readingGlassesBrands) +
      randomSelect(readingGlassesMaterials) +
      '老花镜'
  }

  name += Math.floor(rng() * 10000)

  return {
    name,
    barcode: Math.floor(rng() * Math.pow(10, 10)),
    abbreviation: pinyin(name, {
      style: pinyin.STYLE_FIRST_LETTER
    }).join(''),
    type,
    purchase_price: Math.floor(rng() * 200),
    count: Math.floor(rng() * 20),
    purchase_order_id: Math.floor(rng() * 100),
    created_at,
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}
