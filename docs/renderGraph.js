const nunjucks = require('nunjucks')
const fs = require('fs')
const loadDoc = require('./')
const plantumlEncoder = require('plantuml-encoder')

const run = async () => {
  const docs = await loadDoc()
  const source = nunjucks.renderString(
    fs.readFileSync(`${__dirname}/model.uml.template`, 'utf8'),
    docs
  )

  // console.log(JSON.stringify(docs.components.schemas, null, 2))
  console.log(source) // eslint-disable-line

  return plantumlEncoder.encode(source)
}

run()
  .then(v => `http://www.plantuml.com/plantuml/svg/${v}`)
  .then(url=>`<html>
<body>
<a href="${url}">
  <img src="${url}"/>
</a>
</body>
</html>
`).then(html => fs.writeFileSync('./graph/index.html', html)) // eslint-disable-line
