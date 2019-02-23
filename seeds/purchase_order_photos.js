const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
const uuidv4 = require('uuid/v4')
const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const purchaseOrdersPhoto = []

  const purchaseOrder = await knex('purchase_orders').count('id')

  for (let i = 0; i < 100; i++) {
    purchaseOrdersPhoto.push(
      genPurchaseOrdersPhoto(purchaseOrdersPhoto,purchaseOrder[0].count)
    )
  }

  await knex('purchase_order_photos').truncate()
  await knex('purchase_order_photos').insert(purchaseOrdersPhoto)
}


const arr = [
  'http://tupian.qqjay.com/u/2017/1118/1_162252_8.jpg',
  'http://a3.topitme.com/4/72/90/11282123940a390724o.jpg',
  'http://pic.nipic.com/2008-05-06/200856201542395_2.jpg',
  'http://tupian.qqjay.com/u/2017/1201/2_161641_2.jpg',
  'http://pic.58pic.com/00/96/08/00bOOOPIC1a.jpg',
  'http://wx2.sinaimg.cn/large/94cea970ly1fn2gx5dx4aj20dw0dw0ub.jpg',
  'http://pic.58pic.com/58pic/11/68/32/08658PICred.jpg'
]
function genPurchaseOrdersPhoto(purchaseOrdersPhoto,count) {
  let purchaseOrdersPhotoId
  let findResult

  purchaseOrdersPhotoId = Math.floor(rng() * count) + 1
  findResult = _.findIndex(purchaseOrdersPhoto, {
    person_id: purchaseOrdersPhoto
  })

  while (findResult !== -1) {
    purchaseOrdersPhotoId = Math.floor(rng() * count) + 1
    findResult = _.findIndex(purchaseOrdersPhoto, {
      person_id: purchaseOrdersPhotoId
    })
  }

  const photoUrl = Math.floor(rng()*arr.length)
  const created_at = faker.date.past()
  return {
    created_at: created_at,
    uuid: uuidv4(),
    purchase_order_id: purchaseOrdersPhotoId,
    photo_url: arr[photoUrl],
    updated_at:
      rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at
  }
}

module.exports = main

if (require.main === module) {
  main()
}
