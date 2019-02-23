const sql = `
ALTER TABLE public.products ADD count int NULL;
COMMENT ON COLUMN public.products.count IS '商品数量';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
