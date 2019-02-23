const sql = `
ALTER TABLE public.orders ADD note varchar NULL;
COMMENT ON COLUMN public.orders.note IS '备注';
ALTER TABLE public.orders ADD temp_product_items varchar(1000) NULL;
COMMENT ON COLUMN public.orders.temp_product_items IS '临时产品列表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
