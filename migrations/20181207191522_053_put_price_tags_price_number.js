const sql = `
ALTER TABLE public.price_tags ALTER COLUMN price TYPE numeric(10,4) USING price::numeric(10,4);
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
