import { indexPath } from '../store.js'
import { specialKey } from '../utils/Permission.js'
import Personal from '../views/personal/Personal.vue'
/**
 * 导入依赖的远程接口,推荐直接通过路由的方法访问远程接口,虽然也支持组件自己导入,但是那样不好维护
 */
import ra from '../utils/RemoteApis.js'

/**
 * 这是主页子路由(仅在主页'Home'视图内嵌入显示的页面)
 * 同时也是主页左边菜单栏生成的主要依据
 * 层级结构代表了生成菜单的层级,支持一到两层结构,不要超出两层
 *
 * 注意: 图标仅支持 element-ui 的图标库内的图标
 * 图标地址: https://element.eleme.cn/#/zh-CN/component/icon
 *
 * 除了个人中心在所有角色中都确定存在之外,其他菜单根据不同角色的权限可能不会出现,所有建议全部用异步加载的方式
 */
const menus = [
  {
    type: 'item',
    icon: 'el-icon-s-custom',
    name: '个人中心',
    path: '/',
    redirect: indexPath
  },
  {
    type: 'item',
    icon: 'el-icon-s-custom',
    name: '个人中心',
    path: indexPath,
    component: Personal,
    meta: {
      apis: {
        lid: ra.LoginInfoDo,
        lwd: ra.LoginWxGzhIdDo
      }
    }
  },
  {
    type: 'group',
    name: '系统配置',
    icon: 'el-icon-s-tools',
    open: true,
    items: [
      {
        name: '系统日志',
        path: '/system/logs',
        component: () => import('../views/system/Logs.vue'),
        meta: {
          apis: {
            fls: ra.FileLoggerSel,
            fld: ra.FileLoggerDownloadDo,
            fdd: ra.FileLoggerDeleteDo
          }
        }
      },
      {
        name: '接口文档',
        path: '/system/docs',
        component: () => import('../views/system/Docs.vue'),
        meta: {
          apis: {
            ads: ra.AppDocsSel
          }
        }
      },
      {
        name: '权限定义',
        path: '/system/permission',
        component: () => import('../views/system/Permission.vue'),
        meta: {
          apis: {
            aps: ra.AppPermissionApisSel,
            pas: ra.PerApisSel,
            pau: ra.PerApisUpd,
            ppd: ra.PerPerDel,
            ppi: ra.PerPerIns,
            pps: ra.PerPerSel,
            ppu: ra.PerPerUpd
          },
          specialKey: specialKey // 特别主键
        }
      }
    ]
  },
  {
    type: 'group',
    name: '人员管理',
    icon: 'el-icon-star-on',
    open: false,
    items: [
      {
        name: '系统用户',
        path: '/staffing/user',
        component: () => import('../views/staffing/User.vue'),
        meta: {
          apis: {
            ucs: ra.UserCountSel,
            uus: ra.UserUserSel,
            uui: ra.UserUserIns,
            uuu: ra.UserUserUpd,
            uud: ra.UserUserDel,
            rrs: ra.RegionRegionSel
          },
          specialKey: specialKey // 特别主键
        }
      },
      {
        name: '角色管理',
        path: '/staffing/role',
        component: () => import('../views/staffing/Role.vue'),
        meta: {
          apis: {
            rrs: ra.RoleRoleSel,
            rri: ra.RoleRoleIns,
            rrd: ra.RoleRoleDel,
            rru: ra.RoleRoleUpd,
            pps: ra.PerPerSel,
            rps: ra.RolePermissionSel,
            rpu: ra.RolePermissionUpd,
            rus: ra.RoleUserSel,
            rud: ra.RoleUserDel,
            rui: ra.RoleUserIns,
            ris: ra.UserInfoSel
          },
          specialKey: specialKey // 特别主键
        }
      },
      {
        name: '部门管理',
        path: '/staffing/department',
        component: () => import('../views/staffing/Department.vue'),
        meta: {
          apis: {
            dds: ra.DepDepSel,
            ddi: ra.DepDepIns,
            ddd: ra.DepDepDel,
            ddu: ra.DepDepUpd,
            rrs: ra.RegionRegionSel,
            dus: ra.DepUserSel,
            dad: ra.DepAdminDo,
            dud: ra.DepUserDel,
            dui: ra.DepUserDo
          }
        }
      }
    ]
  },
  {
    type: 'group',
    name: '你的业务',
    icon: 'el-icon-s-goods',
    open: false,
    items: [
      {
        name: '订单管理',
        path: '/message/weChat',
        component: () => import('../views/message/Order.vue')
      },
      {
        name: '财务信息',
        path: '/message/email',
        component: () => import('../views/message/Finance.vue')
      },
      {
        name: '会议安排',
        path: '/message/sms',
        component: () => import('../views/message/Meeting.vue')
      }
    ]
  }
]

export default menus
