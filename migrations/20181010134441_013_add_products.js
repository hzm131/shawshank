const sql = `
CREATE TABLE public.products
(
    id serial PRIMARY KEY,
    uuid uuid,
    abbreviation varchar(30),
    name varchar(50),
    type int,
    purchase_price numeric(10,4),
    created_at timestamp,
    updated_at timestamp
);
COMMENT ON COLUMN public.products.uuid IS '识别码';
COMMENT ON COLUMN public.products.abbreviation IS '助记码';
COMMENT ON COLUMN public.products.name IS '名称';
COMMENT ON COLUMN public.products.type IS '枚举类型';
COMMENT ON COLUMN public.products.purchase_price IS '采购单价 采购时未打折之前每个商品的价格';
COMMENT ON COLUMN public.products.created_at IS '创建时间';
COMMENT ON COLUMN public.products.updated_at IS '更新时间';
COMMENT ON TABLE public.products IS '商品数据表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
