import store, { refreshView } from '../store.js'
import router, { routeList } from '../router/index.js'
import menus from '../router/menus.js'
import { Authority, GetAppPermissionApis, GetLoginPermissionApis } from './Permission.js'
import Home from '../views/Home.vue'
import Error404 from '../views/Error404.vue'
import RefreshView from '../components/RefreshView.vue'

/**
 * 创建VUE需要的实际路由表数据结构,递归遍历,未过滤权限限制
 */
export const RouterList = function () {
  let vueRouterList = [] // 系统VUE全部可用的路由缓存

  function initRouterList (menuList) {
    menuList.forEach(function (menu) {
      if (menu.type != null && menu.type === 'group' && menu.items != null && menu.items.length > 0) {
        initRouterList(menu.items)
      } else {
        vueRouterList.push(menu)
      }
    })
  }

  initRouterList(menus)

  return vueRouterList
}

/**
 * 导出不带默认首页的路由表
 *
 * verify: 验证权限, 根据权限路由表数据作出比对结果判断是否应该加入菜单显示
 */
export const MenusWhitNoIndex = function (verify = false) {
  let data = menus.filter(m => m.path !== '/')
  if (!verify) {
    return data
  }
  let routerList = store.getters.vuePermissionRouterList
  if (routerList == null || routerList.length <= 0) {
    return []
  }
  let newData = []
  data.forEach(group => {
    let type = group.type
    if (type === 'group') {
      let items = group.items
      if (items != null && items.length > 0) {
        let tempItems = []
        items.forEach(item => {
          let index = routerList.findIndex(router => router.path === item.path)
          if (index !== -1) {
            tempItems.push(item)
          }
        })
        if (tempItems.length > 0) {
          let itemData = { // 生成新组,加入菜单集合
            type: group.type,
            name: group.name,
            icon: group.icon,
            open: group.open,
            items: tempItems
          }
          newData.push(itemData)
        }
      }
    } else {
      let index = routerList.findIndex(router => router.path === group.path)
      if (index !== -1) {
        newData.push(group)
      }
    }
  })
  return newData
}

/**
 * 导出首页信息
 */
export const IndexPage = function () {
  let indexPage = null
  RouterList().forEach(page => {
    if (page.path != null && page.path === '/' && page.redirect.length > 1) {
      indexPage = {
        name: page.name,
        path: page.redirect,
        component: page.component
      }
    }
  })
  return indexPage
}

/**
 * 获取路径对应的路由名称(全名),只查询两层层级深度
 */
export const RouterName = function (path) {
  let groupName = ''
  let itemName = ''

  menus.forEach((group) => {
    if (group.type === 'group') {
      group.items.forEach((item) => {
        if (item.path === path) {
          groupName = group.name
          itemName = item.name
        }
      })
    } else {
      if (group.path === path) {
        groupName = group.name
        itemName = ''
      }
    }
  })

  return { 'groupName': groupName, 'itemName': itemName }
}

/**
 * 导出搜索需要的内容
 */
export const SearchResult = function (key = '') {
  let result = []
  MenusWhitNoIndex(true).forEach(menu => {
    if (menu.type === 'group') {
      menu.items.forEach((item) => {
        if (item.name.indexOf(key) !== -1 || item.path.indexOf(key) !== -1) {
          result.push({
            name: item.name,
            fullName: '/' + menu.name + '/' + item.name,
            path: item.path
          })
        }
      })
    } else {
      if (menu.name.indexOf(key) !== -1 || menu.path.indexOf(key) !== -1) {
        result.push({
          name: menu.name,
          fullName: '/' + menu.name,
          path: menu.path
        })
      }
    }
  })
  return result
}

/**
 * 通过路径找到组件
 *
 * @return {null}
 */
export const FindComponent = function (path) {
  let routerList = RouterList()
  let index = routerList.findIndex(router => router.path === path)
  if (index === -1) {
    return null
  } else {
    return routerList[index].component
  }
}

/**
 * 添加动态路由,主页的子路由
 * 路由嵌套: https://segmentfault.com/q/1010000016843139
 * 动态路由: https://blog.csdn.net/weixin_33815613/article/details/88803600
 */
export const AddDynamicRouter = async function () {
  let index = routeList.findIndex(r => r.path === '/Home')
  if (index === -1 || (routeList[index].children === undefined || routeList[index].children.length <= 0)) {
    // 需要经过权限认证处理, 遍历用户权限生成相应的菜单数据
    let temp = await Authority(RouterList())
    // let temp = store.getters.vuePermissionRouterList // 不能使用缓存的数据,可能是有对组件的引用,导致缓存的数据生成路由无效

    // 加入刷新组件,改组件仅仅是让刷新业务有更好看的效果和重要的切换方式
    temp.push({
      type: 'item',
      icon: 'el-icon-s-custom',
      name: '刷新视图',
      path: refreshView,
      component: RefreshView
    })

    let home = {
      path: '/home',
      name: '主页',
      component: Home, // component: () => import('./views/Home.vue'),
      children: temp
    }
    routeList.push(home) // 将数据保存到路由表

    let error404 = {
      path: '*',
      name: 'NotFount',
      component: Error404
    }

    router.addRoutes([home, error404]) // 404页面必须在最后,动态路由404也要动态加入到最后
  }
}

/**
 * 应用程序初始化
 */
export const AppInit = async function () {
  let aa = store.getters.vueAppPermissionApis
  let la = store.getters.vueLoginPermissionApis
  let pr = store.getters.vuePermissionRouterList

  if (aa == null || aa.length <= 0) {
    let appApis = await GetAppPermissionApis() // 系统需要验证的接口
    store.commit('updateAppPermissionApis', appApis)
  }

  if (la == null || la.length <= 0) {
    let loginApis = await GetLoginPermissionApis() // 用户拥有的接口
    store.commit('updateLoginPermissionApis', loginApis)
  }

  if (pr == null || pr.length <= 0) {
    let routerList = await Authority(RouterList()) // 用户的权限路由列表
    store.commit('updatePermissionRouterList', routerList) // 缓存,即使路由表不能用,但是在菜单做权限的比对时还是需要使用
  }

  await AddDynamicRouter()
}
