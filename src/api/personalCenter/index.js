/* eslint-disable */ 
import request from '@/utils/request'
let url = '/rbl-dcportal-center'
// 实名认证
function realNameAuthentication (params) {
  return request({
    method: 'post',
    url: url + '/userInfo/realName',
    data: {
      realName: params.realName,
      idCard: params.idCard
    }
  })
}
// 是否实名
function isRealName () {
  return request({
    method: 'post',
    url: url + '/userInfo/isRealName'
  })
}
// 个人信息查询口【业务员和借款人共用】
function myCenter () {
  return request({
    method: 'post',
    url: url + '/user/mycenter'
  })
}
// OCR识别接口
function recognition (params) {
  return request({
    url: url + '/ocr/recognition',
    method: 'post',
    data: {
      attach: params.attach,
      type: params.type,
      cardNo: params.cardNo
    }
  })
}
// 查看用户实名信息接口
function queryRealNameInfo(params) {
  return request({
    url: url + '/user/queryRealNameInfo',
    method: 'post'
  })
}
export {
  realNameAuthentication,
  isRealName,
  myCenter,
  recognition,
  queryRealNameInfo
}
