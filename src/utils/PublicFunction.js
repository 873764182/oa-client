/**
 * 生成UUID (随机数) https://blog.csdn.net/xiejunna/article/details/91301543
 * var uuidstr = uuid(32,16); // 生成32位长度的基数为16进制: 7FEA14A4722E273EE28C3F72E9E9141F
 * var uuidstr = uuid(32,10); // 生成32位长度的基数为10进制: 17508391034601390293307998456115
 * @return {string}
 */
export const UUID = (len = 32, radix = 16) => {
  let uuidRecord = localStorage.getItem('client_uuid_record')
  if (uuidRecord != null && uuidRecord.length === len) {
    return uuidRecord
  }
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  let i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  let id = uuid.join('')
  localStorage.setItem('client_uuid_record', id)
  return id
}

/**
 * 启动浏览器全屏模式
 */
export const LaunchFullscreen = () => {
  let element = document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else {
    element.webkitRequestFullscreen() // 默认推荐的浏览器为Chrome类型
  }
}

/**
 * 退出浏览器全屏模式
 */
export const ExitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else {
    document.webkitExitFullscreen() // 默认推荐的浏览器为Chrome类型
  }
}

/**
 * 判断数组1是否包含数组2
 *
 * @return {boolean}
 */
export const ContainArray = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false
  }
  if (arr1.length < arr2.length) {
    return false
  }
  let flag = true
  arr2.forEach(a2 => {
    let index = arr1.findIndex(a1 => a1 === a2)
    if (index === -1) {
      flag = false
    }
  })
  return flag
}

/**
 * 判断数组1是否包含数组2中至少一个内容(两个数组是否存在并集)
 *
 * @return {boolean}
 */
export const ExistArray = (arr1, arr2) => {
  if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
    return false
  }
  let flag = false
  arr2.forEach(a2 => {
    let index = arr1.findIndex(a1 => a1 === a2)
    if (index !== -1) {
      flag = true
    }
  })
  return flag
}

/**
 * 两个数组不产生交集
 *
 * @return {boolean}
 */
export const NoExistArray = (arr1, arr2) => {
  if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
    return true
  }
  let flag = true
  arr2.forEach(a2 => {
    let index = arr1.findIndex(a1 => a1 === a2)
    if (index !== -1) {
      flag = false
    }
  })
  return flag
}

/**
 * 时间格式化器
 *
 * 使用: dateFormat("yyyy-MM-dd hh:mm:ss",new Date());
 */
export const DateFormat = (fmt, date) => {
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 下载数据
 * @param name 文件名
 * @param data 数据体
 */
export const DownloadData = (name, data) => {
  if (!data) {
    return
  }
  let blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'
  })
  let url = window.URL.createObjectURL(blob)
  if ('download' in document.createElement('a')) {
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  } else {
    navigator.msSaveBlob(blob, name)
  }
}
