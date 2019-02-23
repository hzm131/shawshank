const errors = require('../../lib/errors')
const model = require('../../model')

const getErrorBodyByCode = code => ({
  code: code,
  message: errors[code].message
})

const cleanTable = name => {
  return model.knex.raw(`TRUNCATE table ${name} RESTART IDENTITY`)
}

module.exports = {
  getErrorBodyByCode,
  cleanTable
}
