const sql = `
ALTER TABLE public.prescriptions RENAME COLUMN user_for TO use_for;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}