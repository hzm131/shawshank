const signale = require('signale')

async function main(){
  await require('./people')()
  await require('./organizations')()
  await require('./users')()
  await require('./purchasers')()
  await require('./suppliers')()
  await require('./purchase_orders')()
  await require('./products')()
  await require('./assemblers')()
  await require('./customers')()
  await require('./optometrists')()
  await require('./prescriptions')()
  await require('./orders')()
  await require('./before_pos_data')()
  await require('./containers')()
  await require('./packages')()
  await require('./price_tags')()
  await require('./product_instance')()
  await require('./purchase_order_photos')()
  await require('./salesmen')()
  await require('./stores')()

  process.exit(0)
}

main().catch(signale.error)
