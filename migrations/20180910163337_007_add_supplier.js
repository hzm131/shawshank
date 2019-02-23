const sql = `
CREATE TABLE public.suppliers
(
    id SERIAL PRIMARY KEY,
    organization_id INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
COMMENT ON COLUMN public.suppliers.organization_id IS '机构id';
COMMENT ON TABLE public.suppliers IS '供应商';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
