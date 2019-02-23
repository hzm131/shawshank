const sql = `
ALTER TABLE public.price_tags RENAME COLUMN product_id TO product_instance_id;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}

