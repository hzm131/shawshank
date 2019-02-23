const sql = `
CREATE TABLE public.price_tags
(
  id serial PRIMARY KEY NOT NULL,
  product_id int,
  uuid varchar,
  price int,
  created_at timestamp,
  updated_at timestamp
);
COMMENT ON COLUMN public.price_tags.id IS '价签id';
COMMENT ON COLUMN public.price_tags.product_id IS '产品id';
COMMENT ON COLUMN public.price_tags.uuid IS '价签uuid';
COMMENT ON COLUMN public.price_tags.price IS '标价';
COMMENT ON COLUMN public.price_tags.created_at IS '创建时间';
COMMENT ON COLUMN public.price_tags.updated_at IS '更新时间';
COMMENT ON TABLE public.price_tags IS '价签表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}

