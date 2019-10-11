/**
 * 权限的认证过程
 * 1. 从服务器获取到需要验证的接口列表 (需要后端接口支持)
 * 2. 从服务器获取自己能访问的接口列表 (需要后端接口支持)
 * 3. 遍历VUE所有的页面级组件，获取组件声明需要的API接口列表 (从各个路由组件的声明获取)
 * 4. 比对每个组件的API接口,哪些接口需要权限认证,哪些接口不需要权限认证,用户是否拥有该权限接口的访问权限
 * 5. 组件需要的多个接口中，当前用户只要有一个接口是可以访问的, 则这个页面，该用户有权限访问，页面不会隐藏
 * */

import store from '../store.js'
import { apiFlag, HTTP } from './HttpAxios.js'
import ra from './RemoteApis.js'

/**
 * 标记返回API的关键字
 */
const gak = {}
gak[apiFlag] = true
export const getApiKey = gak // { 'get_apis_url': true }

/**
 * 跟权限相关的特别ID (管路员标记)
 */
export const specialKey = '100000'

/**
 * 异步方法 获取系统需要权限认证的接口列表 (从后端接口获取)
 */
export const GetAppPermissionApis = async function () {
  // 为了维护方便,通过统一的API管理拿到相应的url接口,发送同步请求
  let url = ra.AppPermissionApisSel(getApiKey)
  let res = await HTTP().post(url) // 发送同步请求
  if (res.data.code !== 0) {
    return []
  }
  let list = res.data.data
  if (list === undefined || list.length <= 0) {
    return []
  }
  // 将树结构的数据转为列表形式(树只有两层)
  let apiArr = []
  list.forEach(rest => {
    let apis = rest.apiList
    if (apis !== undefined && apis.length > 0) {
      apis.forEach(api => {
        apiArr.push(api.apis)
      })
    }
  })
  return apiArr
}

/**
 * 异步方法 获取用户可以访问的权限接口列表 (从后端接口获取)
 */
export const GetLoginPermissionApis = async function () {
  // 通过Store获取登录用户信息
  let userId = store.getters.userId
  if (userId == null || userId.length <= 0) {
    return []
  }
  // 为了维护方便,通过统一的API管理拿到相应的url接口,发送同步请求
  let url = ra.LoginPermissionApisSel(getApiKey)
  let res = await HTTP().post(url, { userId: userId }) // 发送同步请求
  return res.data.data
}

/**
 * 获取路由页面所需要的接口列表
 * children: 遍历子组件依赖 遍历子组件未开发
 * 依赖的子组件: router.component.children 通过递归遍历所有子组件
 */
export const GetRouterPageApi = function (router) {
  let apiList = []
  try {
    if (!router.hasOwnProperty('meta') || !router.meta.hasOwnProperty('apis')) {
      // console.log('路由组件<' + router.name + '>在定义路由时\'meta\'中没有声明权限依赖属性\'apis\'，请检查是否正确。')
      return apiList
    }
    // 获取依赖声明数据
    let dependent = router.meta.apis
    // 获取每个路由组件依赖的接口列表
    let dataType = Object.prototype.toString.call(dependent).toString()
    if (dataType.indexOf('Array') !== -1) { // 数组类型
      dependent.forEach(api => {
        apiList.push(api(getApiKey))
      })
    } else if (dataType.indexOf('Object') !== -1) { // 对象类型
      for (let dep in dependent) {
        if (dependent.hasOwnProperty(dep)) {
          apiList.push(dependent[dep](getApiKey))
        }
      }
    } else if (dataType.indexOf('Function') !== -1) { // 函数类型
      apiList.push(dependent(getApiKey))
    } else {
      console.log('组件(' + router.component.name + ')的DEPENDENT类型错误 => ' + dataType)
    }
  } catch (e) {
    console.log('Permission => GetRouterPageApi 方法解析页面依赖时异常: ' + e.message)
  }
  return apiList
}

/**
 * 验证权限
 * @param pageApis 页面需要的API列表
 * @param loginApis 登录用户拥有的接口列表
 * @param appApis 系统需要认证的接口列表
 * @return {boolean}
 */
export const VerifyPermissions = function (pageApis, loginApis, appApis) {
  if (pageApis.length <= 0) {
    return true // 页面要求的权限为0,不需要认证
  }
  // 计算两个数组的交集 (页面声明的接口不一定是全部需要认证的,交集为需要认证的接口)
  let pageNeedVerify = Array.from(new Set(appApis.filter(v => new Set(pageApis).has(v))))
  if (pageNeedVerify.length <= 0) {
    return true // 依赖的接口里面没有一个是需要权限认证的直接通过认证
  }
  // 页面依赖的接口中只要有一个是用户拥有的即可通过认证(页面会显示出来),内部更细的权限认证通过权限指令控制UI元素的隐藏显示
  let flag = false
  pageNeedVerify.forEach(p => {
    loginApis.forEach(l => {
      if (p === l) {
        flag = true
      }
    })
  })
  // console.log('==========================================================')
  // console.log('页面: ' + JSON.stringify(pageApis))
  // console.log('用户: ' + JSON.stringify(loginApis))
  // console.log('系统: ' + JSON.stringify(appApis))
  // console.log('认证: ' + JSON.stringify(pageNeedVerify))
  // console.log('结果: ' + flag)
  return flag
}

/**
 * 异步方法 权限处理过程
 * @param routerList 系统的路由列表
 * @returns {Array} 权限过滤后的路由列表
 */
export const Authority = async function (routerList) {
  if (!store.getters.isLogin) {
    return [] // 没有登录，路由列表直接返回空
  }

  let appApis = store.getters.vueAppPermissionApis // 系统需要验证的接口
  let loginApis = store.getters.vueLoginPermissionApis // 登录用户拥有的接口

  let vueRouterList = []
  routerList.forEach(router => {
    let pageApis = GetRouterPageApi(router, false) // 获取页面要求的接口
    if (VerifyPermissions(pageApis, loginApis, appApis)) {
      vueRouterList.push(router) // 验证通过,加入路由表
    }
  })

  return vueRouterList
}
