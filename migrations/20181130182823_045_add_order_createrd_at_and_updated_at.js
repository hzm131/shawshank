const sql = `
ALTER TABLE public.orders ADD created_at timestamp NULL;
COMMENT ON COLUMN public.orders.created_at IS '创建时间';
ALTER TABLE public.orders ADD updated_at timestamp NULL;
COMMENT ON COLUMN public.orders.updated_at IS '更新时间';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}


