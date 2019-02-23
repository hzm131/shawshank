const sql = `
ALTER TABLE public.packages ADD container_id int NULL;
COMMENT ON COLUMN public.packages.container_id IS '货柜id';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
