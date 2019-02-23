const sql = `
ALTER TABLE public.orders ADD salesman_id int NULL;
ALTER TABLE public.orders ALTER COLUMN total_price TYPE numeric(10,4) USING total_price::numeric(10,4);
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
