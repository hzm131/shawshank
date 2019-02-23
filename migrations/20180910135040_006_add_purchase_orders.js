const sql = `
CREATE TABLE public.purchase_orders
(
    id SERIAL PRIMARY KEY,
    uuid UUID,
    supplier_id INT,
    purchased_at TIMESTAMP,
    purchaser_id INT,
    editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
CREATE UNIQUE INDEX purchase_orders_uuid_uindex ON public.purchase_orders (uuid);
COMMENT ON COLUMN public.purchase_orders.supplier_id IS '供应商ID';
COMMENT ON COLUMN public.purchase_orders.purchased_at IS '采购日期';
COMMENT ON COLUMN public.purchase_orders.purchaser_id IS '采购人ID';
COMMENT ON COLUMN public.purchase_orders.editable IS '是否可编辑';
COMMENT ON TABLE public.purchase_orders IS '采购单';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
