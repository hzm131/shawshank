const Knex = require('knex')
const { URL } = require('url')
const signale = require('signale')

const {
  DB,
  DEBUG_DB
} = process.env

if(!DB){
  throw new Error('缺少环境变量DB')
}

const db = new URL(DB)

const config = {
  client: db.protocol.replace(/:$/, ''),
  connection: {
    host: db.hostname,
    port: db.port,
    user: db.username,
    password: db.password,
    database: db.pathname.replace('/', ''),
  },
  debug: !!DEBUG_DB,
}

const knex = Knex(config)

knex
  .raw('SELECT 1 + 1 AS result')
  .timeout(1000)
  .then(()=>signale.success('connected to database!'))
  .catch((e) => {
    signale.fatal(e)
    process.exit(1)

    return e
  })

module.exports = {
  knex
}
