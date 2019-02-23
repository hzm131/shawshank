const sql = `
ALTER TABLE public.products ADD purchase_order_id INT NULL;
COMMENT ON COLUMN public.products.purchase_order_id IS '该产品对应的采购单ID';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
