const sql = `
CREATE TABLE public.deleted_records
(
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(30) NOT NULL,
    user_id INT NOT NULL,
    data JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
COMMENT ON COLUMN public.deleted_records.table_name IS '数据来源表';
COMMENT ON COLUMN public.deleted_records.user_id IS '关联的用户id';
COMMENT ON COLUMN public.deleted_records.data IS '被删除的数据';
COMMENT ON TABLE public.deleted_records IS '被删除的记录';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
