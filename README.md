# shawshank-api

初始化
```
git clone git@github.com:hemaoptical/shawshank-api.git
cd shawshank-api
yarn
```

启动开发环境(需要安装nodemon)
```
yarn dev
```

生成一个相对安全的 secret key
```
openssl rand -hex 32
```

如果提示端口被占用如何解决
```
lsof -i:8000
kill 1234 ## 1234 为 COMMAND 为 node 的 PID
```
## 如何登陆

[如何登陆api](https://github.com/hemaoptical/shawshank-api/wiki/%E5%A6%82%E4%BD%95%E7%99%BB%E9%99%86api)

## db相关

```bash
# 安装迁移工具
npm i -g knex

# 创建一个数据库迁移文件
knex migrate:make 00x_add_schemas

# 更新数据库
knex migrate:latest
```
