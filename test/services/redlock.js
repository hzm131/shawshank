const { redlock } = require('../../services/redlock')

it('should be able to unlock a resource', async () => {
  const unlock = await redlock('aa')
  await unlock()
  await redlock('aa')
})

it('should throw a error when resource locked', async () => {
  await redlock('bb')

  try {
    await redlock('bb')
  } catch (e) {
    expect(e.message).toBe('当前资源已被占用')
  }
})
