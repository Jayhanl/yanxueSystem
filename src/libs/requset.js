import axios from 'axios'
import {
  Message
} from 'view-design'
import store from '@/store'
// 设置公共请求头
// const init = function () {
// axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.common.Authorization = store.state.user.token
const root = process.env.NODE_ENV === 'production' ? 'http://39.108.180.164:9302' : '/api'
axios.interceptors.request.use(config => {
  config.url = root + config.url
  return config
}, error => {
  return Promise.reject(error)
})
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    // console.log(response.data.status)
    if (response.data.status === 'failure' && response.data.status !== undefined) {
      if (response.data.data.errCode === 10005) {
        Message.error(response.data.data.errDetail)
      } else {
        Message.error(response.data.data.errMsg)
      }
      return Promise.reject(response)
    } else {
      return Promise.resolve(response)
    }

    // if (response.status === 200) {
    //   if (response.data.access_token) {
    //     axios.defaults.headers.common.Authorization = response.data.access_token
    //   }
    //   return Promise.resolve(response)
    // } else {
    //   return Promise.reject(response)
    // }
  },
  // 错误catch
  error => {
    const errorInfo = error.response
    if (errorInfo.status === 401) {
      store.dispatch('handleLogOut')
    }
    if (errorInfo.data.data.errMsg) {
      Message.error(errorInfo.data.data.errMsg)
    } else {
      Message.error('请求服务器错误')
      return
    }
    if (error.response.status === 401) {
      store.dispatch('handleLogOut')
    }
    return Promise.reject(error)
  }
)
// 封装请求
// }
// async function request (options) {
//   // 这里主要是post方法的封装，get方法同理
//   // options.method = 'post'
//   if (options.config === 'formData') {
//     options.headers = {
//       'Content-Type': 'multipart/form-data'
//     }
//   } else {
//     console.log(123)
//     options.data = qs.stringify(options.data)
//   }
// }
// export default {
//   init
// }
