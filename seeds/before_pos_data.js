const { knex } = require('../services/db')
const faker = require('faker/locale/zh_CN')
const seedrandom = require('seedrandom')
//const _ = require('lodash')
const rng = seedrandom('1')
faker.seed(1)

async function main() {
  const beforeList = []

  for (let i = 0; i < 100; i++) {
    beforeList.push(genBefore(i))
  }
  //console.log(beforeList)
  await knex('before_pos_data').truncate()
  await knex('before_pos_data').insert(beforeList)
}

const arr = ['王','李','赵','钱','孙','何','刘','陈','魏','小']
const arr2 = ['中法','方式','多岁','单数','二维','说的','啊','搜索','大范围','分','爱','订单','多是','股份','嗯','地','人','赋','十点多','大','更','反倒','士大','多']

function genBefore(i) {
  const num5 = Math.floor(rng()*5)
  const num10 = Math.floor(rng()*10)
  const num12 = Math.floor(rng()*11)+1
  const num20 = Math.floor(rng()*20)+10
  const num100 = Math.floor(rng()*100)
  const num2000 = Math.floor(rng()*2000)

  let str = ''
  for(let i=0;i<19;i++){
    const randItem = Math.floor(Math.random() * 10)
    str += randItem
  }
  let date = []
  for(let i=1;i<30;i++){
    date.push(i)
  }
  const time = `${date[Math.floor(rng()*arr.length)]}`
  const name = `${arr[Math.floor(rng()*arr.length)]}${arr2[Math.floor(rng()*arr2.length)]}`

  const created_at = faker.date.past()
  return {
    lsh: ''+(i+1), //订单id
    bm:' ',
    kh: '镜片'+i,  //镜片单位
    name:name,   //姓名
    bz:' ',
    pjrq:'20'+num20+'/'+num12+'/'+time, //配镜日期
    jjmc:'镜架名称'+i, //镜架名称
    jpmc:'镜片名称'+i, //镜片名称
    jjjg:''+ num2000, //镜架价格
    jpjg:''+ num2000, //镜片价格
    age: ''+ (num100+5),  //年龄
    sex:num10%2 === 0 ? '男':'女', //性别
    telephone: ''+faker.phone.phoneNumber(),  //电话
    zhiye: '职业'+i, //职业
    job:' ',
    address:' ',
    note1: '备注'+i, //备注
    yyyqiujing:'球镜右'+i, // 球镜右
    yyzqiujing:'球镜左'+i, // 球镜左
    yyyzhujing:'柱镜右'+i, // 柱镜右
    yyzzhujing:'柱镜 左'+i, // 柱镜左
    yyyzhouwei:'轴位右'+i, // 轴位右
    yyzzhouwei:'轴位左'+i, // 轴位左
    yytongju:'瞳距右'+i, // 瞳距右
    yyyshiju:'下加光右'+i, // 下加光 右
    yyzshiju:'下架光左'+i, // 下加光 左
    yyyjiaozheng:'矫正视力右'+i, // 矫正视力右
    yyzjiaozheng:'矫正视力左'+i, // 矫正视力左
    jyyqiujing:'瞳高右'+i, // 瞳高右
    jyzqiujing:'瞳高左'+i, // 瞳高左
    jyyzhujing:'',
    jyzzhujing:'',
    jyzzhouwei:'',
    jyzshouwei:'',
    jytongju:'',
    jyytongju:'瞳距左'+i, // 瞳距左
    jyyshiju:''+ num10, //镜片折扣
    jyzshiju:''+ num100, //镜片优惠价
    jyyjiaozheng:''+ num10, //镜架折扣
    jyzjiaozheng:''+ num100, //镜架优惠价
    yzzqiujing:'配镜师'+i, //配镜师
    yzyzhujing:'质检员'+i, //质检员
    yxzzhujing:'戴镜史'+i, //戴镜史
    yxyzhouwei:'',
    yzzzhouwei:'',
    yxtongju:'',
    yxyshiju:'',
    yxzshiju:'',
    yxzjiaozheng:'',
    yxyqiujing: '10'+i, //总价
    n1:'12/12/12', //创建时间
    n2:'镜架'+ num10, //镜架单位
    n3:'',
    n4:'',
    n5:str,
    n6:'9'+i, //实收
    n7:'验光师'+i, //验光师
    pjlx:'配镜类型'+ num5, // 配镜类型
    jyyy:num10%2 === 0 ? '近用':'远用', //眼镜用途
    jjcl:'镜架材料'+ num5, //镜架材料
    jjxh:'镜架型号'+ num5, //镜架型号
    jjys:'颜色'+ num5, //镜架颜色
    zsls:'折射率'+num5, //镜片折射率
    mc:'膜层'+num5, //镜片膜层
    bh:'',
    sky:'',
    duanxin:'',
    created_at: created_at, //创建时间
    updated_at: rng() < 0.5 ? faker.date.between(created_at, new Date()) : created_at //更新时间
  }
  /*return {
    lsh: '4651',
    bm: '3386',
    kh: '1',
    name: '陈辉胜',
    bz: '1',
    pjrq: '01/23/17 14:17:06',
    jjmc: 'TR',
    jpmc: '非球面',
    jjjg: '168.0000',
    jpjg: '308.0000',
    sjjg: '380.0000',
    age: '',
    sex: '男',
    telephone: '13767391977',
    zhiye: '',
    job: '',
    address: '',
    /!*yyYqiujing: '-400',
    yyZqiujing: '-375',
    yyYzhujing: '-100',
    yyZzhujing: '-100',
    yyYzhouwei: '168',
    yyZzhouwei: '4',
    //yyTongju: '62',
    yyYshiju: '',
    yyZshiju: '',
    yyYjiaozheng: '',
    yyZjiaozheng: '',
    jyYqiujing: '',
    jyZqiujing: '',
    jyYzhujing: '',
    jyZzhujing: '',
    jyYzhouwei: '',
    jyZzhouwei: '',
    jyTongju: '',
    JYyTONGJU: '',
    jyYshiju: '10',
    jyZshiju: '308',
    jyYjiaozheng: '10',
    jyZjiaozheng: '168',
    yxYqiujing: '476',
    yxZqiujing: '李',
    yxYzhujing: '',
    yxZzhujing: '',
    yxYzhouwei: '',
    yxZzhouwei: '',
    yxTongju: 'chs',
    yxYshiju: '',
    yxZshiju: '',
    yxYjiaozheng: '',
    yxZjiaozheng: '',*!/
    n1: '01/23/17 14:17:06',
    n2: '1',
    n3: '0.0000',
    n4: '0.0000',
    n5: ' ',
    n6: '380',
    n7: ' ',
    pjlx: '框架眼镜',
    //jyYy: '远用',
    jjcl: '混合架',
    jjxh: '',
    jjys: '',
    zsls: '1.553',
    mc: '绿',
    note1: '',
    bh: '',
    sky: '',
    duanxin: '1'
  }*/
}

module.exports = main

if (require.main === module) {
  main()
}
