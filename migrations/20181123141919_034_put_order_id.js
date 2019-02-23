const sql = `
CREATE SEQUENCE public.orders_id_seq NO MINVALUE NO MAXVALUE NO CYCLE;
ALTER TABLE public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq');
ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}


