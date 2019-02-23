const sql = `
CREATE TABLE public.before_pos_data
(
    id int PRIMARY KEY NOT NULL,
    lsh varchar,
    bm varchar,
    kh varchar,
    name varchar,
    bz varchar,
    pjrq varchar,
    jjmc varchar,
    jpmc varchar,
    jjjg varchar,
    jpjp varchar,
    sjjg varchar,
    age varchar,
    sex varchar,
    telephone varchar,
    zhiye varchar,
    job varchar,
    address varchar,
    note1 varchar,
    yyYqiujing varchar,
    yyZqiujing varchar,
    yyYzhujing varchar,
    yyZzhujing varchar,
    yyYzhouwei varchar,
    yyZzhouwei varchar,
    yyTongju varchar,
    yyYshiju varchar,
    yyZshiju varchar,
    yyYjiaozheng varchar,
    yyZjiaozheng varchar,
    jyYqiujing varchar,
    jyZqiujing varchar,
    jyYzhujing varchar,
    jyZzhujing varchar,
    jyZzhouwei varchar,
    jyZshouwei varchar,
    jyTongju varchar,
    JYyTONGJU varchar,
    jyYshiju varchar,
    jyZshiju varchar,
    jyYjiaozheng varchar,
    jyZjiaozheng varchar,
    yzZqiujing varchar,
    yzYzhujing varchar,
    yxZzhujing varchar,
    yxYzhouwei varchar,
    yzZzhouwei varchar,
    yxTongju varchar,
    yxYshiju varchar,
    yxZshiju varchar,
    yxZjiaozheng varchar,
    n1 varchar,
    n2 varchar,
    n3 varchar,
    n4 varchar,
    n5 varchar,
    n6 varchar,
    n7 varchar,
    pjlx varchar,
    jyYy varchar,
    jjcl varchar,
    jjxh varchar,
    jjys varchar,
    zsls varchar,
    mc varchar,
    bh varchar,
    sky varchar,
    duanxin varchar
);
COMMENT ON COLUMN public.before_pos_data.lsh IS '订单id';
COMMENT ON COLUMN public.before_pos_data.kh IS '镜片单位';
COMMENT ON COLUMN public.before_pos_data.name IS '姓名';
COMMENT ON COLUMN public.before_pos_data.pjrq IS '配镜日期';
COMMENT ON COLUMN public.before_pos_data.jjmc IS '镜架名称(名称）';
COMMENT ON COLUMN public.before_pos_data.jpmc IS '镜片名称';
COMMENT ON COLUMN public.before_pos_data.jjjg IS '镜架价格';
COMMENT ON COLUMN public.before_pos_data.jpjp IS '镜片价格';
COMMENT ON COLUMN public.before_pos_data.age IS '年龄';
COMMENT ON COLUMN public.before_pos_data.sex IS '性别';
COMMENT ON COLUMN public.before_pos_data.telephone IS '电话';
COMMENT ON COLUMN public.before_pos_data.zhiye IS '职业';
COMMENT ON COLUMN public.before_pos_data.job IS '(没有使用，地址)';
COMMENT ON COLUMN public.before_pos_data.address IS '(没有使用，地址)';
COMMENT ON COLUMN public.before_pos_data.note1 IS '备注';
COMMENT ON COLUMN public.before_pos_data.yyYqiujing IS '球镜 右';
COMMENT ON COLUMN public.before_pos_data.yyZqiujing IS '球镜 左';
COMMENT ON COLUMN public.before_pos_data.yyYzhujing IS '柱镜 右';
COMMENT ON COLUMN public.before_pos_data.yyZzhujing IS '柱镜 左';
COMMENT ON COLUMN public.before_pos_data.yyYzhouwei IS '轴位 右';
COMMENT ON COLUMN public.before_pos_data.yyZzhouwei IS '轴位 左';
COMMENT ON COLUMN public.before_pos_data.yyTongju IS '瞳距 右';
COMMENT ON COLUMN public.before_pos_data.yyYshiju IS '下加光 右';
COMMENT ON COLUMN public.before_pos_data.yyZshiju IS '下加光 左';
COMMENT ON COLUMN public.before_pos_data.yyYjiaozheng IS '矫正视力 右';
COMMENT ON COLUMN public.before_pos_data.yyZjiaozheng IS '矫正视力 左';
COMMENT ON COLUMN public.before_pos_data.jyYqiujing IS '瞳高 右';
COMMENT ON COLUMN public.before_pos_data.jyZqiujing IS '瞳高 左';
COMMENT ON COLUMN public.before_pos_data.JYyTONGJU IS '瞳距 左';
COMMENT ON COLUMN public.before_pos_data.jyYshiju IS '镜片折扣';
COMMENT ON COLUMN public.before_pos_data.jyZshiju IS '镜片优惠价';
COMMENT ON COLUMN public.before_pos_data.jyYjiaozheng IS '镜架折扣';
COMMENT ON COLUMN public.before_pos_data.jyZjiaozheng IS '镜架优惠价';
COMMENT ON COLUMN public.before_pos_data.yzZqiujing IS '配镜师';
COMMENT ON COLUMN public.before_pos_data.yzYzhujing IS '质检员';
COMMENT ON COLUMN public.before_pos_data.yxZzhujing IS '戴镜史';
COMMENT ON COLUMN public.before_pos_data.n1 IS '创建时间';
COMMENT ON COLUMN public.before_pos_data.n2 IS '镜架单位';
COMMENT ON COLUMN public.before_pos_data.n5 IS '卡号';
COMMENT ON COLUMN public.before_pos_data.n7 IS '验光师';
COMMENT ON COLUMN public.before_pos_data.pjlx IS '配镜类型';
COMMENT ON COLUMN public.before_pos_data.jyYy IS '眼镜用途';
COMMENT ON COLUMN public.before_pos_data.jjcl IS '镜架材料';
COMMENT ON COLUMN public.before_pos_data.jjxh IS '镜架型号';
COMMENT ON COLUMN public.before_pos_data.jjys IS '镜架颜色';
COMMENT ON COLUMN public.before_pos_data.zsls IS '镜架折射率';
COMMENT ON COLUMN public.before_pos_data.mc IS '镜片膜层';
COMMENT ON TABLE public.before_pos_data IS '老销售系统数据';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
