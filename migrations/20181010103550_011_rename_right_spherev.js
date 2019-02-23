const sql = `
ALTER TABLE public.prescriptions RENAME COLUMN right_spherev TO right_sphere;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}