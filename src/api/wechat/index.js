/* eslint-disable */ 
/* 微信相关接口 */
import request from '@/utils/request'
let url = '/rbl-dcportal-center/'
/* 回调接口，获取openId */
function getOpenId (params) {
  return request({
    url: url + 'wxp/notifyuriforlg?code=' + params.code + '&state=' + params.state + '&scope=' + params.scope,
    method: 'get'/*
    params: {
      code: params.code,
      state: params.state
    } */
  })
}

/* 用户通过openID无感登陆 */
function getOpenIdLogin (params) {
  return request({
    url: url + 'user/openLogin',
    method: 'post',
    data: {
      openId: params.openId
    }
  })
}

/* 获取JS-SDK使用权限签名 */
function signature (params) {
  return request({
    url: url + 'wxp/js/signature',
    method: 'post',
    data: {
      uri: params.uri
    }
  })
}

/* 推广分享链接 */
function getShareuri (params) {
  return request({
    url: url + 'wxp/shareuri',
    method: 'post',
    data: {
      unionUserId: params.unionUserId,
      redirectUri: params.redirectUri
    }
  })
}

/* 业务员产品分享链接 */
function getShareProduct (params) {
  return request({
    url: url + 'wxp/sale/shareuri',
    method: 'post',
    data: {
      unionUserId: params.unionUserId,
      productNo: params.productNo,
      redirectUri: params.redirectUri,
      title: params.title,
      imgUrl: params.imgUrl
    }
  })
}
/* 借款人产品分享链接 */
function getLoanShareProduct (params) {
  return request({
    url: url + 'wxp/loan/sale/shareuri',
    method: 'post',
    data: {
      unionUserId: params.unionUserId,
      productNo: params.productNo,
      redirectUri: params.redirectUri,
      title: params.title,
      imgUrl: params.imgUrl
    }
  })
}
export {
  getOpenId,
  getOpenIdLogin,
  signature,
  getShareuri,
  getShareProduct,
  getLoanShareProduct
}
