const sql = `
CREATE TABLE public.stores
(
    id serial PRIMARY KEY,
    name varchar,
    address varchar,
    phone_number varchar,
    organization_id int,
    created_at timestamp,
    updated_at timestamp
);
COMMENT ON COLUMN public.stores.id IS '门店id';
COMMENT ON COLUMN public.stores.name IS '门店名称';
COMMENT ON COLUMN public.stores.address IS '门店地址';
COMMENT ON COLUMN public.stores.phone_number IS '联系电话';
COMMENT ON COLUMN public.stores.organization_id IS '机构信息表关联id';
COMMENT ON COLUMN public.stores.created_at IS '创建时间';
COMMENT ON COLUMN public.stores.updated_at IS '更新事假';
COMMENT ON TABLE public.stores IS '门店';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
