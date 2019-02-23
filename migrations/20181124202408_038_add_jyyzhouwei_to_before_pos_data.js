const sql = `
ALTER TABLE public.before_pos_data ADD jyyzhouwei varchar NULL;
ALTER TABLE public.before_pos_data ADD yxyjiaozheng varchar NULL;
ALTER TABLE public.before_pos_data ADD yxyqiujing varchar NULL;
ALTER TABLE public.before_pos_data ADD yxyzhujing varchar NULL;
ALTER TABLE public.before_pos_data ADD yxzqiujing varchar NULL;
ALTER TABLE public.before_pos_data ADD yxzzhouwei varchar NULL;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
