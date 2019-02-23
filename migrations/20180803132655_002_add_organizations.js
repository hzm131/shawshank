const sql = `
CREATE TABLE public.organizations
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    abbreviation VARCHAR(50),
    address VARCHAR(50),
    zip_code VARCHAR(10),
    phone_number VARCHAR(20),
    credit_code VARCHAR(30),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
COMMENT ON COLUMN public.organizations.name IS '机构名称';
COMMENT ON COLUMN public.organizations.abbreviation IS '机构简称';
COMMENT ON COLUMN public.organizations.address IS '机构地址';
COMMENT ON COLUMN public.organizations.zip_code IS '邮编';
COMMENT ON COLUMN public.organizations.phone_number IS '联系电话';
COMMENT ON COLUMN public.organizations.credit_code IS '统一社会信用代码';
COMMENT ON TABLE public.organizations IS '机构';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
