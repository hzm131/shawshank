const sql = `
CREATE TABLE public.people
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    abbreviation VARCHAR(30),
    email VARCHAR(50),
    sex INT,
    job VARCHAR(30),
    birthday DATE,
    birthday_infer DATE,
    identification_number VARCHAR(30),
    educational_background VARCHAR(30),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    mobile VARCHAR(30)
);
COMMENT ON COLUMN public.people.name IS '名称';
COMMENT ON COLUMN public.people.abbreviation IS '简称或拼音 速查用';
COMMENT ON COLUMN public.people.email IS '邮箱';
COMMENT ON COLUMN public.people.sex IS '性别 0:男； 1:女；';
COMMENT ON COLUMN public.people.job IS '职业';
COMMENT ON COLUMN public.people.birthday IS '生日';
COMMENT ON COLUMN public.people.birthday_infer IS '从年龄推断的出生日期';
COMMENT ON COLUMN public.people.identification_number IS '身份证号';
COMMENT ON COLUMN public.people.educational_background IS '教育背景';
COMMENT ON COLUMN public.people.mobile IS '手机号';
COMMENT ON TABLE public.people IS '人员信息表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
