const sql = `
CREATE TABLE public.packages
(
    id serial PRIMARY KEY,
    uuid uuid,
    created_at timestamp,
    updated_at timestamp
);
COMMENT ON COLUMN public.packages.uuid IS '包装盒编码';
COMMENT ON COLUMN public.packages.created_at IS '创建时间 ';
COMMENT ON COLUMN public.packages.updated_at IS '更新时间';
COMMENT ON TABLE public.packages IS '包装盒表';

CREATE TABLE public.product_instances
(
    id serial PRIMARY KEY,
    uuid uuid,
    product_id int,
    package_id int,
    created_at timestamp,
    updated_at timestamp
);
COMMENT ON COLUMN public.product_instances.uuid IS '商品唯一编码';
COMMENT ON COLUMN public.product_instances.product_id IS '商品id';
COMMENT ON COLUMN public.product_instances.package_id IS '包装盒id';
COMMENT ON COLUMN public.product_instances.created_at IS '创建时间';
COMMENT ON COLUMN public.product_instances.updated_at IS '更新时间';
COMMENT ON TABLE public.product_instances IS '商品实例表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
