/**
 * 项目全部的远程接口调用 接口的说明请打开后端服务: /app/docs 页面查看详情
 */
import { GET, POST } from './HttpAxios'

const APIS = {
  /**
   * 文件上传
   */
  FileUpload: p => {
    return POST('/file/upload', p)
  },

  /**
   * 下载日志
   */
  FileLoggerDownloadDo: p => {
    return GET('/file/loggerDownload.do', p)
  },

  /**
   * 删除日志
   */
  FileLoggerDeleteDo: p => {
    return POST('/file/loggerDelete.do', p)
  },

  /**
   * 获取接口文档数据（HTML格式）
   */
  AppDocsSel: p => {
    return GET('/app/docs.sel', p)
  },

  /**
   * 获取系统中所有需要权限认证的接口列表
   */
  AppPermissionApisSel: p => {
    return POST('/app/permissionApis.sel', p)
  },

  /**
   * 查询用户可以访问的权限接口列表(需要传入用户ID作为参数)
   */
  LoginPermissionApisSel: p => {
    return POST('/login/permissionApis.sel', p)
  },

  /**
   * 账号登陆
   */
  LoginAccountDo: p => {
    return POST('/login/account.do', p)
  },

  /**
   * 微信登陆
   */
  LoginWxGzhIdDo: p => {
    return POST('/login/wxGzhId.do', p)
  },

  /**
   * 获取用户信息
   */
  LoginInfoDo: p => {
    return POST('/login/info.do', p)
  },

  /**
   * 获取系统目前定义的权限列表
   */
  PerPerSel: p => {
    return POST('/per/per.sel', p)
  },

  /**
   * 新增一条系统权限定义
   */
  PerPerIns: p => {
    return POST('/per/per.ins', p)
  },

  /**
   * 更新一条系统权限定义
   */
  PerPerUpd: p => {
    return POST('/per/per.upd', p)
  },

  /**
   * 删除一条系统权限定义
   */
  PerPerDel: p => {
    return POST('/per/per.del', p)
  },

  /**
   * 根据权限ID查询权限拥有的API列表
   */
  PerApisSel: p => {
    return POST('/per/apis.sel', p)
  },

  /**
   * 更新指定ID权限API列表数据
   */
  PerApisUpd: p => {
    return POST('/per/apis.upd', p)
  },

  /**
   * 查询用户列表数据
   */
  UserUserSel: p => {
    return POST('/user/user.sel', p)
  },

  /**
   * 查询用户列表用户总数
   */
  UserCountSel: p => {
    return POST('/user/count.sel', p)
  },

  /**
   * 新增用户
   */
  UserUserIns: p => {
    return POST('/user/user.ins', p)
  },

  /**
   * 修改用户
   */
  UserUserUpd: p => {
    return POST('/user/user.upd', p)
  },

  /**
   * 删除用户
   */
  UserUserDel: p => {
    return POST('/user/user.del', p)
  },

  /**
   * 查询用户信息
   */
  UserInfoSel: p => {
    return POST('/user/info.sel', p)
  },

  /**
   * 解析密码
   UserResolveSel: p => {
    return POST('/user/resolve.sel', p)
  }, */

  /**
   * 更新角色里的用户
   RoleRoleUpd: p => {
    return POST('/user/role.upd', p)
  } */

  /**
   * 获取地区
   */
  RegionRegionSel: p => {
    return POST('/region/region.sel', p)
  },

  /**
   * 获取日志
   */
  FileLoggerSel: p => {
    return POST('/file/logger.sel', p)
  },

  /**
   * 角色列表
   */
  RoleRoleSel: p => {
    return POST('/role/role.sel', p)
  },

  /**
   * 添加角色
   */
  RoleRoleIns: p => {
    return POST('/role/role.ins', p)
  },

  /**
   * 删除角色
   */
  RoleRoleDel: p => {
    return POST('/role/role.del', p)
  },

  /**
   * 更新角色
   */
  RoleRoleUpd: p => {
    return POST('/role/role.upd', p)
  },

  /**
   * 角色权限
   */
  RolePermissionSel: p => {
    return POST('/role/permission.sel', p)
  },

  /**
   * 角色权限绑定
   */
  RolePermissionUpd: p => {
    return POST('/role/permission.upd', p)
  },

  /**
   * 角色用户列表
   */
  RoleUserSel: p => {
    return POST('/role/user.sel', p)
  },

  /**
   * 删除角色里的用户
   */
  RoleUserDel: p => {
    return POST('/role/user.del', p)
  },

  /**
   * 添加角色里的用户
   */
  RoleUserIns: p => {
    return POST('/role/user.ins', p)
  },

  /**
   * 部门列表
   */
  DepDepSel: p => {
    return POST('/dep/dep.sel', p)
  },

  /**
   * 新增部门
   */
  DepDepIns: p => {
    return POST('/dep/dep.ins', p)
  },

  /**
   * 删除部门
   */
  DepDepDel: p => {
    return POST('/dep/dep.del', p)
  },

  /**
   * 修改部门
   */
  DepDepUpd: p => {
    return POST('/dep/dep.upd', p)
  },

  /**
   * 部门用户
   */
  DepUserSel: p => {
    return POST('/dep/user.sel', p)
  },

  /**
   * 设置部门管理员
   */
  DepAdminDo: p => {
    return POST('/dep/admin.do', p)
  },

  /**
   * 删除部门用户
   */
  DepUserDel: p => {
    return POST('/dep/user.del', p)
  },

  /**
   * 添加部门用户
   */
  DepUserDo: p => {
    return POST('/dep/user.do', p)
  }
}

export default APIS
