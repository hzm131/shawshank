const sql = `
CREATE SEQUENCE public.before_pos_data_id_seq NO MINVALUE NO MAXVALUE NO CYCLE;
ALTER TABLE public.before_pos_data ALTER COLUMN id SET DEFAULT nextval('public.before_pos_data_id_seq');
ALTER SEQUENCE public.before_pos_data_id_seq OWNED BY public.before_pos_data.id;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
