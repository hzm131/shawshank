const sql = `
CREATE TABLE public.prescriptions
(
    id serial PRIMARY KEY,
    user_for int,
    vertex_distance int,
    right_spherev int,
    left_sphere int,
    right_cylinder int,
    left_cylinder int,
    right_cylinder_axis int,
    left_cylinder_axis int,
    right_corrected_vision numeric(2,1),
    left_corrected_vision numeric(2,1),
    right_papillary_distance int,
    left_papillary_distance int,
    right_add int,
    left_add int,
    right_prism int,
    right_prism_base int,
    left_prism int,
    left_prism_base int,
    expires_at timestamp,
    created_at timestamp,
    updated_at timestamp
);
COMMENT ON COLUMN public.prescriptions.user_for IS '远用：0  近用：1';
COMMENT ON COLUMN public.prescriptions.vertex_distance IS '镜眼距、顶点距、镜角距VD 一般眼镜12mm角膜接触0mm';
COMMENT ON COLUMN public.prescriptions.right_spherev IS '右眼球镜度SPH';
COMMENT ON COLUMN public.prescriptions.left_sphere IS '左眼球镜度SPH';
COMMENT ON COLUMN public.prescriptions.right_cylinder IS '右眼柱镜度CYL';
COMMENT ON COLUMN public.prescriptions.left_cylinder IS '左眼柱镜度CYL';
COMMENT ON COLUMN public.prescriptions.right_cylinder_axis IS '右眼柱镜轴位Axis';
COMMENT ON COLUMN public.prescriptions.left_cylinder_axis IS '左眼柱镜轴位Axis';
COMMENT ON COLUMN public.prescriptions.right_corrected_vision IS '右眼矫正视力';
COMMENT ON COLUMN public.prescriptions.left_corrected_vision IS '左眼矫正视力';
COMMENT ON COLUMN public.prescriptions.right_papillary_distance IS '右眼瞳距';
COMMENT ON COLUMN public.prescriptions.left_papillary_distance IS '左眼瞳距';
COMMENT ON COLUMN public.prescriptions.right_add IS '右眼下加光';
COMMENT ON COLUMN public.prescriptions.left_add IS '左眼下加光';
COMMENT ON COLUMN public.prescriptions.right_prism IS '右眼棱镜度';
COMMENT ON COLUMN public.prescriptions.right_prism_base IS '右眼棱镜度基底 上：0 右：1 下：2 左：3 ';
COMMENT ON COLUMN public.prescriptions.left_prism IS '左眼棱镜度';
COMMENT ON COLUMN public.prescriptions.left_prism_base IS '左眼棱镜度基底 上：0 右：1 下：2 左：3';
COMMENT ON COLUMN public.prescriptions.expires_at IS '验光度数过期时间，由验光师评估当前用户的度数需多久复测';
COMMENT ON COLUMN public.prescriptions.created_at IS '创建时间';
COMMENT ON COLUMN public.prescriptions.updated_at IS '更新时间';
COMMENT ON TABLE public.prescriptions IS '验光单数据表';
`

exports.up = function(knex) {
  return knex.schema.raw(sql)
}

exports.down = function() {}