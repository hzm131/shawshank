const sql = `
COMMENT ON COLUMN public.before_pos_data.n6 IS '实收';
COMMENT ON COLUMN public.before_pos_data.yxyqiujing IS '总价';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}

