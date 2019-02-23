const redis = require('./redis-client')
const pFinally = require('p-finally')

const namespace = 'redlock'

/**
 * simple version of redlock
 * @see https://redis.io/topics/distlock
 *
 * @params {string} resource 资源名称 用于唯一定位需要获取锁的资源
 * @params {string} timeout 资源锁定时间, 以毫秒为单位 默认 1s
 */
async function redlock(resource, timeout = 1000) {
  const key = `${namespace}:${resource}`

  const isOk = await redis.setAsync(key, 1, 'PX', timeout, 'NX')
  if (!isOk) throw new Error('当前资源已被占用')

  return function unlock() {
    return redis.delAsync(key)
  }
}

/**
 * 保证包裹在中间的函数能正确释放锁
 *
 *  const result = await Locker('/abc:123:resource')(async ()=>{
 *    return '22';
 *  }); // result = 22
 */
const Locker = (...args) => async (asyncFn) => {
  const unlock = await redlock(...args)

  return pFinally(asyncFn(), unlock)
}

module.exports = {
  redlock,
  Locker
}

/**
 * usage
router.post('/my-router', async (ctx) => {
  const userId = await ctx.ensureLogin();

  const result = await Locker(`${ctx.path}:${userId}`)(async ()=>{
    // 业务逻辑
    return '22';
  }).catch(()=>Promise.reject({ code: 403001 })); // 当前资源正在被占用，请稍后再试

  console.log(result) // 22
});

// or
router.post('/my-router', async (ctx) => {
  const userId = await ctx.ensureLogin();

  const locker = Locker(`${ctx.path}:${userId}`);

  await locker(async ()=> {
    // 业务逻辑1
  }); // 锁1 已经解开了

  await locker(async ()=> {
    // 业务逻辑2
  }); // 锁2 已经解开了
});

*/

/**
 * test
 *
async function run(){
  // 测试解锁
  const unlock = await redlock('aa');
  await unlock()
  await redlock('aa');
  // 测试资源被占用是报错
  await redlock('bb');
  await redlock('bb');
}

try {
  run();
} catch (e){
  console.error('xxxx', e);
}
*/
