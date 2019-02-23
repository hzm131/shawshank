const sql = `
CREATE TABLE public.users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30),
    password VARCHAR(64),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
COMMENT ON COLUMN public.users.username IS '用户名';
COMMENT ON COLUMN public.users.password IS '密码，sha256加密';
COMMENT ON COLUMN public.users.created_at IS '创建时间';
COMMENT ON COLUMN public.users.updated_at IS '更新时间';
COMMENT ON TABLE public.users IS '用户表';

CREATE TABLE public.user_login_logs
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    updated_at TIMESTAMP,
    created_at TIMESTAMP
);
COMMENT ON COLUMN public.user_login_logs.user_id IS '用户ID';
COMMENT ON COLUMN public.user_login_logs.updated_at IS '更新时间';
COMMENT ON COLUMN public.user_login_logs.created_at IS '创建时间';
COMMENT ON TABLE public.user_login_logs IS '用户登录日志表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}
