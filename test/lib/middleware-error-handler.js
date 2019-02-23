const errorHandlerMiddleware = require('../../lib/middleware-error-handler')
const Joi = require('joi')

jest.mock('../../lib/errors', () => ({
  400001: {
    status: 400,
    message: 'hello {{ name }}'
  }
}))

it('should handle joi error', async () => {
  const handler = errorHandlerMiddleware()
  const ctx = {}

  await handler(ctx, async () => {
    const { error } = Joi.validate('asdf', Joi.boolean())
    return Promise.reject(error)
  })

  expect(ctx.body.code).toEqual(400002)
})

it('should handle normal error', async () => {
  const handler = errorHandlerMiddleware()
  const ctx = {}
  const error = new Error('normal error')

  try {
    await handler(ctx, async () => {
      throw error
    })
  } catch (e) {
    expect(e).toEqual(error)
  }
})

it('should throw error when error code is not predifined', async () => {
  const handler = errorHandlerMiddleware()
  const ctx = {}
  const error = { code: 0 }

  try {
    await handler(ctx, async () => {
      throw error
    })
  } catch (e) {
    expect(e.message).toEqual('错误码未定义')
  }
})

it('should render error message when error has another properties', async () => {
  const handler = errorHandlerMiddleware()
  const ctx = { set: () => true }
  const error = { code: 400001, name: 'mofe' }

  await handler(ctx, async () => {
    throw error
  })

  expect(ctx.body.message).toEqual('hello mofe')
})
