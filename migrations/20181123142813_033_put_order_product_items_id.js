const sql = `
CREATE SEQUENCE public.order_product_items_id_seq NO MINVALUE NO MAXVALUE NO CYCLE;
ALTER TABLE public.order_product_items ALTER COLUMN id SET DEFAULT nextval('public.order_product_items_id_seq');
ALTER SEQUENCE public.order_product_items_id_seq OWNED BY public.order_product_items.id;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}



