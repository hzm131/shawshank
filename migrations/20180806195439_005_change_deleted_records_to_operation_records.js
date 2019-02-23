const sql = `
ALTER TABLE public.deleted_records RENAME TO operation_records;
ALTER TABLE public.operation_records ADD type VARCHAR(20) NULL;
COMMENT ON COLUMN public.operation_records.type IS '操作类型，如 update delete';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
