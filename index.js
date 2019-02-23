const signale = require('signale')
const app = require('./app')

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  signale.success(`server: http://localhost:${PORT}/`)
  signale.note(`doc: http://petstore.swagger.io/?url=http%3A%2F%2Flocalhost%3A${PORT}%2Foas.yaml`)
})
