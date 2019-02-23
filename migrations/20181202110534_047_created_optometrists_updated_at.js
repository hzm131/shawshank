const sql = `
ALTER TABLE public.optometrists ADD updated_at timestamp NULL;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}


