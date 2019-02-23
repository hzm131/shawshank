const sql = `
CREATE TABLE public.assemblers
(
  id int PRIMARY KEY NOT NULL,
  person_id int,
  created_at timestamp,
  updated_at timestamp
);
COMMENT ON COLUMN public.assemblers.id IS '装配师id';
COMMENT ON COLUMN public.assemblers.person_id IS '用户对应的人员信息';
COMMENT ON COLUMN public.assemblers.created_at IS '创建时间';
COMMENT ON COLUMN public.assemblers.updated_at IS '更新时间';
COMMENT ON TABLE public.assemblers IS '眼镜装配师';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}



