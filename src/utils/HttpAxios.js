import axios from 'axios'
import store from '../store.js'

/**
 * 基础路径
 */
export const baseUrl = '/apis'

/**
 * 获取API的标记
 */
export const apiFlag = 'get_apis_url'

// 基础路径
axios.defaults.baseURL = baseUrl
// 超时时间
axios.defaults.timeout = 30 * 1000

// 添加业务默认请求头
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.post['h-type'] = 'console'
axios.defaults.headers.post['h-ver'] = 20190906
axios.defaults.headers.post['h-time'] = new Date().getTime()
axios.defaults.headers.post['h-id'] = store.getters.deviceId
axios.defaults.headers.post['h-token'] = store.getters.userToken

/**
 * 导出HTTP客户端对象
 */
export const HTTP = function () {
  return axios
}

/**
 * 通用的GET请求
 */
export function HttpGet (url, params) {
  return new Promise((resolve, reject) => {
    if (!params) {
      params = {} // 默认参数体
    }
    axios.get(url, { params: params })
      .then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res)
          console.log('网络错误 GET => ' + JSON.stringify(res))
        }
      }).catch(err => {
        reject(err)
        console.log('网络异常 GET => ' + JSON.stringify(err))
      })
  })
}

/**
 * 通用的POST请求
 */
export function HttpPost (url, params) {
  return new Promise((resolve, reject) => {
    if (!params) {
      params = {} // 默认参数体
    }
    axios.post(url, params)
      .then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res)
          console.log('网络错误 POST => ' + JSON.stringify(res))
        }
      }).catch(err => {
        reject(err)
        console.log('网络异常 POST => ' + JSON.stringify(err))
      })
  })
}

/**
 * 再一次包装处理 GET,权限模块检查直接返回url地址
 */
export function GET (url, params) {
  if (params != null && params.hasOwnProperty(apiFlag)) {
    return url
  } else {
    return HttpGet(url, params)
  }
}

/**
 * 再一次包装处理 POST,权限模块检查直接返回url地址
 */
export function POST (url, params) {
  if (params != null && params.hasOwnProperty(apiFlag)) {
    return url
  } else {
    return HttpPost(url, params)
  }
}
