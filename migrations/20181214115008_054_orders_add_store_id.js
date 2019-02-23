const sql = `
ALTER TABLE public.orders ADD store_id int NULL;
COMMENT ON COLUMN public.orders.store_id IS '门店id';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
