const sql = `
CREATE TABLE public.salesmen
(
    id serial PRIMARY KEY,
    person_id int,
    created_at timestamp,
    updated_at timestamp
);
COMMENT ON COLUMN public.salesmen.id IS '销售员ID';
COMMENT ON COLUMN public.salesmen.person_id IS '销售员关联的人员信息';
COMMENT ON COLUMN public.salesmen.created_at IS '创建时间';
COMMENT ON COLUMN public.salesmen.updated_at IS '更新时间';
COMMENT ON TABLE public.salesmen IS '销售员表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}


