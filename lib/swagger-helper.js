/**
 * swagger中可以共用的对象
 */
module.exports = {
  page: {
    in: 'query',
    name: 'page',
    description: '列表页中当前页数',
    type: 'integer',
    default: 1,
    required: false
  },
  pagesize: {
    in: 'query',
    name: 'pagesize',
    description: '列表页中单个页面的对象数量',
    type: 'integer',
    default: 10,
    required: false
  },
  unexpectedError: {
    description: '非预期中的错误',
    schema: {
      $ref: '#/definitions/Error'
    }
  },
  messageSchema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: '提示消息'
      }
    }
  },
  getPagedSchema(modelName) {
    return {
      type: 'object',
      properties: {
        count: {
          type: 'integer'
        },
        rows: {
          type: 'array',
          items: {
            $ref: `#/definitions/${modelName}`
          }
        }
      }
    }
  },
  getDataSchema(modelName, otherProperties) {
    return {
      type: 'object',
      properties: Object.assign({
        data: {
          $ref: `#/definitions/${modelName}`
        }
      }, otherProperties)
    }
  }
}
