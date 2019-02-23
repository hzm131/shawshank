const sql = `
ALTER TABLE public.customers ALTER COLUMN member_card_number TYPE varchar USING member_card_number::varchar;
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}


