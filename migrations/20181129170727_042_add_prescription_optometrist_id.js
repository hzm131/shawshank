const sql = `
ALTER TABLE public.prescriptions ADD optometrist_id int NULL;
COMMENT ON COLUMN public.prescriptions.optometrist_id IS '验光师id';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}

