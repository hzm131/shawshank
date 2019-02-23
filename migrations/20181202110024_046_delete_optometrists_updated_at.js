const sql = `
ALTER TABLE public.optometrists DROP updated_at;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}


