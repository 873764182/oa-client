/**
 * Vuex的一些用法和介绍
 * 入门简介：https://segmentfault.com/a/1190000017750095?utm_source=tag-newest#articleHeader9
 * Vuex多文件分模块：https://blog.csdn.net/xuzelei123/article/details/86540761
 * 解决浏览器刷新vuex数据丢失：https://www.cnblogs.com/xuweijin/p/10442428.html
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { UUID } from './utils/PublicFunction'

Vue.use(Vuex)

/**
 * 主页home页面的子路由首页路径
 */
export const indexPath = '/home/personal'

/**
 * 刷新视图的路由路径,特殊的组件,不参与业务计算
 */
export const refreshView = '/view/refresh'

/**
 * Vuex state 初始数据集合
 */
let vuexStoreState = {
  // 设备唯一号,仅在当前域名下的应用唯一
  deviceNumber: UUID(32, 16),
  // 标题栏区域的标签数据
  headNavTabs: [],
  // 是否是刷新标签
  refreshNavTabs: false,
  // 当前路由地址(仅主页子路由有效)
  headCurrentRoute: indexPath,
  // 登陆的用户信息
  loginUserInfo: {},
  // 菜单列表模式是标准类型,标准菜单还是小型菜单
  leftMenuTypeStandard: true,
  // 程序需要验证的权限接口列表
  appPermissionApis: [],
  // 登陆用户拥有的权限接口列表
  loginPermissionApis: [],
  // 权限过滤后用户拥有的路由列表
  permissionRouterList: []
}

/**
 * 初始化时将刷新前数据还原到Vuex
 */
let vuexStoreData = sessionStorage['vuex_store_data']
if (vuexStoreData != null && vuexStoreData.length > 5) {
  vuexStoreState = JSON.parse(vuexStoreData)
}

/**
 * 在页面刷新前将vuex里的信息保存到sessionStorage里，避免浏览器的主动刷新导致数据丢失
 */
window.addEventListener('beforeunload', () => {
  sessionStorage['vuex_router_refresh'] = 'true'
  sessionStorage['vuex_store_data'] = JSON.stringify(vuexStoreState)
})

/**
 * 获取登陆用户信息
 */
function getLoginUser (state) {
  if (state.loginUserInfo == null) {
    state.loginUserInfo = {}
  }
  return state.loginUserInfo
}

/**
 * Vuex Store 主体
 */
export default new Vuex.Store({
  /**
   * 数据状态
   */
  state: vuexStoreState,
  /**
   * 唯一可以修改state内容的地方
   */
  mutations: {
    /**
     * 退出登录，删除登录用户数据
     */
    doLogout: function (state, params) {
      state.loginUserInfo = {}
      state.headNavTabs = []
      state.headCurrentRoute = indexPath
      state.leftMenuTypeStandard = true
      state.appPermissionApis = []
      state.loginPermissionApis = []
      state.permissionRouterList = []
    },
    /**
     * 添加一个导航栏标签
     */
    addHeadNavTab: (state, params) => {
      if (state.headNavTabs == null) {
        state.headNavTabs = []
      }

      /* 检查是否已经存在导航标签 */
      function existNva (path) {
        let flag = false
        state.headNavTabs.forEach(tab => {
          if (tab.path === path) {
            flag = true
          }
        })
        return flag
      }

      if (!existNva(params.path)) {
        state.headNavTabs.push(params)
      }
    },
    /**
     * 是否计划要刷新标签
     */
    updateRefreshNavTabs: (state, params) => {
      state.refreshNavTabs = params
    },
    /**
     * 删除一个导航栏标签,同时返回被删除元素的索引
     */
    subHeadNavTab: (state, params) => {
      let index = state.headNavTabs.findIndex(tab => tab.path === params.path)
      if (index !== -1) {
        state.headNavTabs.splice(index, 1) // 删除元素
      }
      return index
    },
    /**
     * 修改当前标签栏活跃路由信息
     */
    updateCurrentRoute: (state, params) => {
      state.headCurrentRoute = params
    },
    /**
     * 保存登录信息
     */
    saveLoginUser: (state, params) => {
      state.loginUserInfo = params
    },
    /**
     * 改变左边菜单类型
     */
    updateLeftMenuType: (state, params) => {
      state.leftMenuTypeStandard = params
    },
    /**
     * 更新 appPermissionApis
     */
    updateAppPermissionApis: (state, params) => {
      state.appPermissionApis = params
    },
    /**
     * 更新 loginPermissionApis
     */
    updateLoginPermissionApis: (state, params) => {
      state.loginPermissionApis = params
    },
    /**
     * 更新 permissionRouterList
     */
    updatePermissionRouterList: (state, params) => {
      state.permissionRouterList = params
    }
  },
  /**
   * 全局的公共方法
   */
  actions: {},
  /**
   * Vuex计算属性，取值请尽量通过该属性获取，而不是直接从state获取（类似Vue computed）
   */
  getters: {
    vueAppPermissionApis (state) {
      return state.appPermissionApis
    },
    vueLoginPermissionApis (state) {
      return state.loginPermissionApis
    },
    vuePermissionRouterList (state) {
      return state.permissionRouterList
    },
    deviceId (state) {
      return state.deviceNumber
    },
    isLogin (state) {
      let info = getLoginUser(state)
      return (info != null && info !== {} && info.hasOwnProperty('token'))
    },
    userInfo (state) {
      return getLoginUser(state)
    },
    userToken (state) {
      return getLoginUser(state).token
    },
    userId (state) {
      return getLoginUser(state).userId
    },
    userName (state) {
      return getLoginUser(state).username
    }
  }
})
