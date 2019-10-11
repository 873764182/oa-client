import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router/index.js'
import store from './store.js'
import { AppInit } from './utils/MenuHelper.js'
import { getApiKey } from './utils/Permission.js'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { DateFormat } from './utils/PublicFunction'

Vue.config.productionTip = false

Vue.use(ElementUI)

/**
 * 全局设置路由守卫,处理动态路由浏览器刷新问题
 */
router.beforeEach((to, from, next) => {
  NProgress.start() // 顶部进度条 开始
  if (store.getters.isLogin && sessionStorage.getItem('vuex_router_refresh') === 'true') {
    // 根据权限初始化路由表信息
    AppInit().finally(r => {
      // console.log('router.beforeEach => ' + JSON.stringify(r))
    })
    // 刷新状态完成,还原状态监听下次浏览器刷新
    sessionStorage['vuex_router_refresh'] = 'false'
  }
  next() // 执行跳转
})

router.afterEach(() => {
  NProgress.done() // 顶部进度条 完成
})

/**
 * 定义一个全局的VUE指令,处理页面元素与权限的关系(显示/隐藏)
 */
Vue.directive('permission', {
  inserted: (el, binding, vNode) => { // vnode.context.$route.meta;
    let vapa = store.getters.vueAppPermissionApis
    let vlpa = store.getters.vueLoginPermissionApis

    if (Array.isArray(binding.value)) { // 可以传入数组
      binding.value.forEach(rely => {
        let api = rely(getApiKey)
        let ai = vapa.findIndex(a => a === api) // 检查该接口是否被系统要求做权限认证
        let li = vlpa.findIndex(a => a === api) // 检查用户是否拥有该接口的权限

        if (ai !== -1 && li === -1) {
          el.style.display = 'none' // 只要元素依赖的接口列表有一个不能满足就隐藏元素 (and 模式)
        }
      })
    } else {
      let relyApi = (binding.value)(getApiKey) // 获取到原始的接口路径
      let ai = vapa.findIndex(api => api === relyApi) // 检查该接口是否被系统要求做权限认证
      let li = vlpa.findIndex(api => api === relyApi) // 检查用户是否拥有该接口的权限

      // 该依赖接口需要权限认证,但是用户却没有拥有该接口权限,则隐藏元素
      if (ai !== -1 && li === -1) {
        // el.parentNode.removeChild(el)  // 删除元素(直接删除元素可能会有元素找不到布局错乱等错误,所以使用隐藏处理)
        el.style.display = 'none' // 隐藏元素
      }
    }
  }
})

/**
 * 定义一个全局的过滤器,处理时间格式化
 */
Vue.filter('longTimeFormat', function (value, format = 'yyyy-MM-dd hh:mm:ss') {
  if (value === undefined || value == null || parseInt(value) <= 0) {
    return '0000-00-00 00:00:00'
  }
  return DateFormat(format, new Date(value))
})

/**
 * 定义一个全局的过滤器,处理数据为空的情况
 */
Vue.filter('nullDataHandler', function (value, def = '') {
  if (value === undefined || value == null || value.toString().length <= 0) {
    return def
  }
  return value
})

// 全局混入，关闭tab时清除组件缓存
Vue.mixin({
  beforeRouteLeave (to, from, next) {
    setTimeout(() => {
      // 检查标签是否被删除
      let index = this.$store.state.headNavTabs.findIndex(t => t.path === from.path)
      let isDeleteCache = (index === -1)
      // 删除缓存 (或者刷新标签也需要删除缓存)
      if (isDeleteCache || this.$store.state.refreshNavTabs) {
        this.$store.commit('updateRefreshNavTabs', false)

        if (this.$vnode.parent && this.$vnode.parent.componentInstance.cache) {
          let key = this.$vnode.key // 当前关闭的组件名
          let cache = this.$vnode.parent.componentInstance.cache // 缓存的组件
          let keys = this.$vnode.parent.componentInstance.keys // 缓存的组件名
          const cached = cache[key]
          if (cached != null) {
            cached.componentInstance.$destroy()
            delete cache[key]
            let index = keys.indexOf(key)
            if (index > -1) {
              keys.splice(index, 1)
            }
          }
        }
      }
    }, 150)
    next()
  }
})

new Vue({ router, store, render: h => h(App) }).$mount('#app')
