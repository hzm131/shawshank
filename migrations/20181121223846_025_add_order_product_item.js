const sql = `
CREATE TABLE public.order_product_item
(
  id int PRIMARY KEY NOT NULL,
  order_id int,
  product_instance_id int
);
COMMENT ON COLUMN public.order_product_item.id IS '销售订单id';
COMMENT ON COLUMN public.order_product_item.order_id IS '订单id';
COMMENT ON COLUMN public.order_product_item.product_instance_id IS '对应的产品实例id';
COMMENT ON TABLE public.order_product_item IS '订单产品项';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}

