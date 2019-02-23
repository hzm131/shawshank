const sql = `
CREATE SEQUENCE public.assemblers_id_seq NO MINVALUE NO MAXVALUE NO CYCLE;
ALTER TABLE public.assemblers ALTER COLUMN id SET DEFAULT nextval('public.assemblers_id_seq');
ALTER SEQUENCE public.assemblers_id_seq OWNED BY public.assemblers.id;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
