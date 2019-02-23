const sql = `
ALTER TABLE public.products RENAME COLUMN uuid TO barcode;
ALTER TABLE public.products ALTER COLUMN barcode TYPE VARCHAR(50) USING barcode::VARCHAR(50);
COMMENT ON COLUMN public.products.barcode IS '识别码/条码';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}


