/* 银行卡模块接口 */
import request from '@/utils/request'
let url = '/rbl-dcpay-center'
// 已绑定银行卡列表
function bindedCards () {
    return request({
        method: 'post',
        url: url + '/repayment/bankcard/bindcards'
    })
}
// 卡bin查询
function cardbin (data) {
    return request({
        method: 'post',
        url: url + '/repayment/bankcard/cardbin',
        data: {
            'cardNo': data.cardNo
        }
    })
}
// 绑卡预签订
function preSign (data) {
    return request({
        method: 'post',
        url: url + '/repayment/bankcard/presign',
        data: {
            'cardNo': data.cardNo,
            'userName': data.userName,
            'telephone': data.telephone,
            'idcard': data.idcard,
            'bankcode': data.bankcode,
            'channelType': '1'
        }
    })
}
// 绑卡确认签约
function confirmSign (data) {
    return request({
        method: 'post',
        url: url + '/repayment/bankcard/confirmsign',
        data: {
            'cardNo': data.cardNo,
            'userName': data.userName,
            'telephone': data.telephone,
            'idcard': data.idcard,
            'bankcode': data.bankcode,
            'channelType': '1',
            'smsVrifyCode': data.smsVrifyCode, // 短信验证码
            'protocolNo': data.protocolNo, // 签约唯一码
            'bankName': data.bankName
        }
    })
}
// 支持银行
function supportBanks () {
    return request({
        method: 'post',
        url: url + '/repayment/bankcard/supportbank',
        data: {
            channelType: 1
        }
    })
}
// 支付发送短信接口
function sendMsg (data) {
    return request({
        method: 'post',
        url: url + '/repayment/sendMsg',
        data: {
            cardNo: data.cardNo,
            tradeAmount: data.tradeAmount,
            productCode: data.productCode
        }
    })
}
// 确认支付接口（带验证码）
function repaymentWithCode (data) {
    return request({
        method: 'post',
        url: url + '/repayment/repaymentWithCode',
        data: {
            cardNo: data.cardNo,
            telephone: data.telephone,
            tradeAmount: data.tradeAmount,
            productCode: data.productCode,
            repaymentType: '1',
            verificationCode: data.verificationCode,
            cardId: data.cardId
        }
    })
}
// 支付订单接口
function paymentRecord (data) {
    return request({
        method: 'post',
        url: url + '/repayment/paymentRecord',
        data: {
            paymentTime: data.paymentTime
        }
    })
}
export {
  bindedCards,
  supportBanks,
  preSign,
  cardbin,
  confirmSign,
  sendMsg,
  repaymentWithCode,
  paymentRecord
}
