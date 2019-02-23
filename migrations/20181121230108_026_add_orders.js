const sql = `
CREATE TABLE public.orders
(
  id int PRIMARY KEY NOT NULL,
  customer_id int,
  assembler_id int,
  prescription_id int,
  total_price int
);
COMMENT ON COLUMN public.orders.id IS '销售订单id';
COMMENT ON COLUMN public.orders.customer_id IS '客户订单表';
COMMENT ON COLUMN public.orders.assembler_id IS '装配师';
COMMENT ON COLUMN public.orders.prescription_id IS '验光单表单';
COMMENT ON COLUMN public.orders.total_price IS '总价';
COMMENT ON TABLE public.orders IS '销售订单表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}

