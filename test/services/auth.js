const auth = require('../../services/auth')
const authHelper = require('../helpers/auth')

describe('deserializeUserId', () => {
  it('should handle tokenExpire Error', async () => {
    const token = await authHelper.generateTokenByUserId(1, {
      tokenExpiresIn: '0s'
    })

    try {
      await auth.deserializeUserId(token.access_token)
    } catch (e){
      expect(e.code).toEqual(401002)
    }
  })

  it('should verity token signature', async () => {
    const token = await authHelper.generateTokenByUserId(1)

    try {
      await auth.deserializeUserId(token.access_token + '2134')
    } catch (e){
      expect(e.code).toEqual(401005)
    }
  })
})
