const sql = `
CREATE TABLE public.purchase_order_photo
(
    id serial PRIMARY KEY NOT NULL,
    purchase_order_id int,
    uuid varchar,
    photo_url varchar,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
COMMENT ON COLUMN public.purchase_order_photo.purchase_order_id IS '采购订单ID';
COMMENT ON COLUMN public.purchase_order_photo.uuid IS '二维码中的信息';
COMMENT ON COLUMN public.purchase_order_photo.photo_url IS '照片的URL';
COMMENT ON COLUMN public.purchase_order_photo.created_at IS '创建时间';
COMMENT ON COLUMN public.purchase_order_photo.updated_at IS '更新时间';
COMMENT ON TABLE public.purchase_order_photo IS '采购订单照片表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
