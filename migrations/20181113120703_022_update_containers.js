const sql = `
ALTER TABLE public.container RENAME TO containers;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
