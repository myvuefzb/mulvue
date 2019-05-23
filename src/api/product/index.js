/* eslint-disable */ 
/* 产品模块接口 */
import request from '@/utils/request'
let url = '/rbl-dcportal-center/'
/* 产品列表、推荐产品接口 */
function getProductList (params) {
  return request({
    url: url + 'product/list',
    method: 'post',
    data: {
      pageSize: params.pageSize || '',
      pageNum: params.pageNum || '',
      isRecommend: params.isRecommend || '',
      openId: params.openId || ''
    }
  })
}
/* 产品详情接口 */
function getProductDetail (params) {
  return request({
    url: url + 'product/infodetail',
    method: 'post',
    data: {
      productNo: params.productNo
    }
  })
}

/* 用户申请贷款产品接口 */
function getPlaceOrder (params) {
  return request({
    url: url + 'loanorder/placeorder',
    method: 'post',
    data: {
      productNo: params.productNo
    }
  })
}
// 用户申请贷款产品接口
function placeorder (params) {
  return request({
    url: url + 'loanorder/placeorder',
    method: 'post',
    data: {
      salesManId: params.salesManId,
      productNo: params.productNo
    }
  })
}
export {
  getProductList,
  getProductDetail,
  getPlaceOrder,
  placeorder
}
