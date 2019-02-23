const request = require('supertest')

const app = require('../../app')
const authHelper = require('../helpers/auth')
const utilHelper = require('../helpers/util')
const model = require('../../model')

let org
let token
beforeAll(async () => {
  token = await authHelper.login()

  org = await model.BeforePosData.forge({
    lsh: '1',
    bm: '1',
    kh: '1',
    name: '姓名',
    bz: '1',
    pjrq: '1',
    jjmc: '1',
    jpmc: '1',
    jjjg: '1',
    jpjg: '1',
    sjjg: '1',
    age: '1',
    sex: '1',
    telephone: '13122179125',
    zhiye: '1',
    job: '1',
    address: '11',
    yyyqiujing: '1',
    yyzqiujing: '1',
    yyyzhujing: '1',
    yyzzhujing: '1',
    yyyzhouwei: '1',
    yyzzhouwei: '1',
    yytongju: '1',
    yyyshiju: '1',
    yyzshiju: '1',
    yyyjiaozheng: '1',
    yyzjiaozheng: '1',
    jyyqiujing: '1',
    jyzqiujing: '1',
    jyyzhujing: '1',
    jyzzhujing: '1',
    jyyzhouwei: '1',
    jyzzhouwei: '1',
    jytongju: '1',
    jyytongju: '1',
    jyyshiju: '1',
    jyzshiju: '11',
    jyyjiaozheng: '1',
    jyzjiaozheng: '1',
    yxyqiujing: '1',
    yxzqiujing: '1',
    yxyzhujing: '1',
    yxzzhujing: '1',
    yxyzhouwei: '1',
    yxzzhouwei: '1',
    yxtongju: '1',
    yxyshiju: '1',
    yxzshiju: '1',
    yxyjiaozheng: '1',
    yxzjiaozheng: '1',
    n1: '1',
    n2: '1',
    n3: '1',
    n4: '1',
    n5: '1234567891111111111',
    n6: '1',
    n7: '1',
    pjlx: '1',
    jyyy: '1',
    jjcl: '1',
    jjxh: '1',
    jjys: '1',
    zsls: '1',
    mc: '1',
    note1: '1',
    bh: '1',
    sky: '1',
    duanxin: '1',
    yzzqiujing: '1',
    yzyzhujing: '1',
  }).save()
})

afterAll(async ()=>{
  await Promise.all([
    utilHelper.cleanTable('before_pos_data'),
  ])
})

describe('router/before_pos_data', () => {
  it('get /v1/before_pos_data', async () => {

    const res = await request(app.listen())
      .get('/v1/before_pos_data?limit=10&offset=0')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

  it('get /v 1/before_pos_data with where_name_or_n5_or_telephone_like filter', async () => {
    const res = await request(app.listen())
      .get('/v1/before_pos_data?limit=10&offset=0&where_name_or_n5_or_telephone_like=13122179125')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(1)
  })

  it('get /v 1/before_pos_data with where_name_eq filter', async () => {
    const str = '姓名'
    const name = encodeURIComponent(str)
    const res = await request(app.listen())
      .get(`/v1/before_pos_data?limit=10&offset=0&where_name_eq=${name}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(1)
  })
  it('get /v 1/before_pos_data with where_telephone_eq filter', async () => {
    const res = await request(app.listen())
      .get('/v1/before_pos_data?limit=10&offset=0&where_telephone_eq=13122179125')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(1)
  })
  it('get /v 1/before_pos_data with where_n5_eq filter', async () => {
    const res = await request(app.listen())
      .get('/v1/before_pos_data?limit=10&offset=0&where_n5_eq=1234567891111111111')
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(1)
  })
  it('get /v1/before_pos_data/:id', async () => {
    const res = await request(app.listen())
      .get(`/v1/before_pos_data/${org.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)

    expect(res.status).toBe(200)
  })

})

