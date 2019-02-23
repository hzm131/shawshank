const loadDocs = require('../../docs/index')

describe('docs/index', () => {
  it('should use cache when load docs twice', async () => {
    const docs = await loadDocs()
    const docs2 = await loadDocs()

    expect(docs).toEqual(docs2)
  })
})
