const sql = `
CREATE TABLE public.optometrists
(
  id int PRIMARY KEY NOT NULL,
  person_id int,
  created_at timestamp,
  updated_at int
);
COMMENT ON COLUMN public.optometrists.id IS '验光师id';
COMMENT ON COLUMN public.optometrists.person_id IS '用户对应的人员信息';
COMMENT ON COLUMN public.optometrists.created_at IS '创建时间';
COMMENT ON COLUMN public.optometrists.updated_at IS '更新时间';
COMMENT ON TABLE public.optometrists IS '验光师';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}

