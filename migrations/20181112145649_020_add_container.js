const sql = `
CREATE TABLE public.container
(
    id serial PRIMARY KEY NOT NULL,
    name VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
COMMENT ON COLUMN public.container.id IS '货柜id';
COMMENT ON COLUMN public.container.name IS '货柜名称';
COMMENT ON COLUMN public.container.created_at IS '创建时间';
COMMENT ON COLUMN public.container.updated_at IS '更新时间';
COMMENT ON TABLE public.container IS '货柜表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
