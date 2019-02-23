const sql = `
CREATE UNIQUE INDEX users_username_uindex ON public.users (username);
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
