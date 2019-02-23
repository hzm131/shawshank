const sql = `
CREATE SEQUENCE public.optometrists_id_seq NO MINVALUE NO MAXVALUE NO CYCLE;
ALTER TABLE public.optometrists ALTER COLUMN id SET DEFAULT nextval('public.optometrists_id_seq');
ALTER SEQUENCE public.optometrists_id_seq OWNED BY public.optometrists.id;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
