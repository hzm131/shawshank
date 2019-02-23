const sql = `
ALTER TABLE purchase_order_photo RENAME TO purchase_order_photos;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
