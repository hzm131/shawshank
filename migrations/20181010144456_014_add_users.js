const sql = `
ALTER TABLE public.users ADD person_id int NULL;
COMMENT ON COLUMN public.users.person_id IS '当前用户对应的人员信息';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}


