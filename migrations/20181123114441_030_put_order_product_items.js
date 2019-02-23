const sql = `
ALTER TABLE public.order_product_item RENAME TO order_product_items;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
