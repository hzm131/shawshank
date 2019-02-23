const sql = `
ALTER TABLE public.before_pos_data ADD created_at timestamp NULL;
COMMENT ON COLUMN public.before_pos_data.created_at IS '创建时间';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
