/* eslint-disable */
import axios from 'axios'
import Native from '@/common/native.js';
// import qs from 'qs'
import { md5 } from 'vux'
const CryptoJS = require('crypto-js')
function encrypt (word) {
  var key = CryptoJS.enc.Utf8.parse('abcd!@#$%^&*()_+')
  var srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
  // return encrypted.toString()
  return encrypted.ciphertext.toString().toUpperCase()
}
let userInfoStr = localStorage.getItem('getUserInfo')
let deviceInfoStr = localStorage.getItem('getDeviceInfo')
let deviceInfo = JSON.parse(deviceInfoStr)
/* 默认参数 */
const jsonObj = {
  ...deviceInfo
  // userType: '0' // 用户类型
}
/* 创建axios实例 */
/*
*
* */
const BASE_API = process.env.BASE_API
const service = axios.create({
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded'
    'Content-Type': 'application/json'
   //  'Content-Type': 'text/plain;charset=UTF-8'
  },
  transformRequest: [
    function (data) {
      // Do whatever you want to transform the data
      // const request = qs.stringify(Object.assign(data || {}, jsonObj))
      return data
    }
  ],
  // params: jsonObj,
  paramsSerializer: function (params) {
    // return qs.stringify(Object.assign(params || {}, jsonObj))
  },
  baseURL: BASE_API,
  timeout: 30000, // 请求超时时间
  method: 'post',
  responseType: 'json'
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.method = config.method || 'post'
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    /* 合并默认参数 */
    let tokenObj = {
      accessToken: '5bd436ea1719c1fa06e2e90d83a50e7e' // 用户token
    }
    let userInfo = userInfoStr?JSON.parse(userInfoStr): {accessToken:'5bd436ea1719c1fa06e2e90d83a50e7e'}
    if(userInfo.accessToken) {
      localStorage.setItem('accessToken',userInfo.accessToken)
      tokenObj.accessToken = localStorage.getItem('accessToken')
    } else {
      tokenObj.accessToken = localStorage.getItem('accessToken')
    }
    // tokenObj.accessToken = userInfo.accessToken?userInfo.accessToken: ''

    config.data = Object.assign(config.data || {}, jsonObj, tokenObj)
    /* 非微信接口请求，参数加密处理 */
    if (config.url.indexOf('wxp') === -1 && config.url.indexOf('ocr/recognition') === -1) {
      /* 参数加密处理 */
      let _key = 'rblAPIKey+6g2K3W5V67xJFdfbB8Qz'
      let currentTime = new Date().getTime()
      let sign = md5(JSON.stringify(config.data) + currentTime + _key)
      let params = {
        data: JSON.stringify(config.data),
        currentTime: currentTime,
        sign: sign
      }
      let data = {
        'params': encrypt(JSON.stringify(params))
      }
      config.data = JSON.stringify(data)
    } else {
      config.data = JSON.stringify(config.data)
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * status为非200并且code非0是抛错
     */
    const res = response.data
    const status = response.status
    const isSuccess = status === 200
    console.log(res)
    let invalidTokenNumber = res.ret
    console.log('token invalid:'+ invalidTokenNumber)
    console.log('开始调用原生tokenInvalid方法:'+ Native.NRouter.tokenInvalid)
    if (invalidTokenNumber) {
      if(parseInt(invalidTokenNumber) === 9999) {
        // 清空数据
        localStorage.setItem('storeFirstStepInfo', '')
        Native.NRouter.tokenInvalid()
      }
    }
    return isSuccess ? Promise.resolve(res) : Promise.reject(res)
  },
  error => {
    if (error.response && error.response.data) {
      Native.NUI.tip({
        text: (error.response.data.retMsg) ? (error.response.data.retMsg) : ('response code:' + error.response.status),
      });
    } else {
      if (error.message && (error.message.indexOf('timeout') >= 0)) {
        Native.NUI.tip({text: '网络超时'});
      } else {
        Native.NUI.tip({text: '网络异常'});
      }
    }
    return Promise.reject(error)
  }
)

export default service
