/* eslint-disable */ 
/* 首页接口 */
import request from '@/utils/request'
let url = '/rbl-dcportal-center/'
/* 获取用户信息 */
function getInfo (params) {
  return request({
    url: url + 'index/info',
    method: 'post',
    data: {
      storeId: params.storeId || '',
      salesmanId: params.salesmanId || ''
    }
  })
}
/* 门店列表接口 */
function queryStores () {
  return request({
    url: url + 'salesman/querystores',
    method: 'post',
    data: {
      // accessToken: params.accessToken
    }
  })
}

/* 业务员列表接口 */
function querySales (params) {
  return request({
    url: url + 'salesman/querysales',
    method: 'post',
    data: {
      storeId: params.storeId
    }
  })
}
// 选择支付产品列表接口
function queryApplyProductList (data) {
  return request({
    method: 'post',
    url: url + 'loanorder/queryApplyProductList',
    data: {
      productName: data.productName,
      pageSize: data.pageSize || 10,
      pageNum: data.pageNum
    }
  })
}
export {
  getInfo,
  queryStores,
  querySales,
  queryApplyProductList
}
