import Vue from 'vue'
import Router from 'vue-router'
import ra from '../utils/RemoteApis.js'

Vue.use(Router)

export const routeList = [
  {
    name: '/',
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: '首页',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/Login.vue'),
    meta: {
      apis: {
        lad: ra.LoginAccountDo,
        lwd: ra.LoginWxGzhIdDo
      }
    }
  }
]

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routeList
})

export default router
