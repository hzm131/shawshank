const sql = `
CREATE TABLE public.purchasers
(
    id SERIAL PRIMARY KEY,
    person_id INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
COMMENT ON COLUMN public.purchasers.person_id IS '引用people表的id';
COMMENT ON TABLE public.purchasers IS '采购员表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
