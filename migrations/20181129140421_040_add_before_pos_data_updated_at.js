const sql = `
ALTER TABLE public.before_pos_data ADD updated_at timestamp NULL;
COMMENT ON COLUMN public.before_pos_data.updated_at IS '更新时间';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
