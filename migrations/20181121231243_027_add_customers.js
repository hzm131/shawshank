const sql = `
CREATE TABLE public.customers
(
  id int PRIMARY KEY NOT NULL,
  member_card_number int,
  person_id int,
  created_at timestamp,
  updated_at timestamp
);
COMMENT ON COLUMN public.customers.id IS '客户id';
COMMENT ON COLUMN public.customers.member_card_number IS '会员卡号';
COMMENT ON COLUMN public.customers.person_id IS '用户对应的人员信息';
COMMENT ON COLUMN public.customers.created_at IS '创建时间';
COMMENT ON COLUMN public.customers.updated_at IS '更新时间';
COMMENT ON TABLE public.customers IS '客户表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}



