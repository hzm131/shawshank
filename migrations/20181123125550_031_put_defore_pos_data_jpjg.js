const sql = `
ALTER TABLE public.before_pos_data RENAME COLUMN jpjp TO jpjg;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
