const sql = `
ALTER TABLE public.prescriptions ALTER COLUMN right_papillary_distance TYPE numeric(5,1) USING right_papillary_distance::numeric(5,1);
ALTER TABLE public.prescriptions ALTER COLUMN left_papillary_distance TYPE numeric(5,1) USING left_papillary_distance::numeric(5,1);
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
