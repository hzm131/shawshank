const sql = `
CREATE SEQUENCE public.customers_id_seq NO MINVALUE NO MAXVALUE NO CYCLE;
ALTER TABLE public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq');
ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
