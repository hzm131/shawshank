/**
 * 根据code返回错误信息
 *
 * 状态码释义
 *   400: 传输过来的参数格式不合法
 *   401: 认证相关的错误
 *   403: 代码执行过程中不符合预期的错误
 *   404: 暂时不用, 如果找不到资源直接返回 { data: null} 或 { rows:[], count: 0 }
 */
module.exports = {
  /**
   * 400
   */
  400001: {
    status: 400,
    message: 'sessionId 不合法'
  },
  400002: {
    /**
     * Joi独占的错误码
     *
     * 业务逻辑里不要手动抛出这个错误
     */
    status: 400,
    message: '参数验证失败'
  },
  /**
   * 401
   */
  401001: {
    status: 401,
    message: '缺失 access_token'
  },
  401002: {
    status: 401,
    message: 'access_token 超时'
  },
  401003: {
    status: 401,
    message: 'access_token 不合法'
  },
  401004: {
    status: 401,
    message: 'access_token 被禁用'
  },
  401005: {
    status: 401,
    message: 'access_token 的签名验证不通过'
  },
  /**
   * 403
   */
  403001: {
    status: 403,
    message: '当前资源正在被占用，请稍后再试'
  },
  403002: {
    status: 403,
    message: '手机号或密码不正确'
  },
  403003: {
    status: 403,
    message: '需要封禁的 session 不属于当前用户'
  },
  403004: {
    status: 403,
    message: '数据库操作出错，详情请联系系统管理员'
  },
  403005: {
    status: 403,
    message: '上传的文件类型不合法，请检查上传文件是否为jpg/jpeg/png/gif等图片格式'
  },
  /**
   * 404
   */
}
