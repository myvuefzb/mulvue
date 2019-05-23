/* eslint-disable */ 
/* 登录模块接口 */
import request from '@/utils/request'
let url = '/rbl-dcportal-center/'
/* 发送验证码 */
function sendSms (params) {
  return request({
    url: url + 'user/sendsms',
    method: 'post',
    data: {
      phone: params.phone,
      oper: params.oper
    }
  })
}
/* 注册 */
function custRegist (params) {
  return request({
    url: url + 'user/salesRegist',
    method: 'post',
    data: {
      account: params.account,
      passwd: params.passwd,
      openId: params.openId,
      smsMsg: params.smsMsg,
      oper: params.oper,
      unionUserId: params.unionUserId
    }
  })
}

/* 修改账号 */
function updateAccount (params) {
  return request({
    url: url + 'user/updateAccount',
    method: 'post',
    data: {
      oldPhone: params.oldPhone,
      newPhone: params.newPhone,
      loginPwd: params.loginPwd,
      smsMsg: params.smsMsg,
      userType: params.userType,
      userId: params.userId,
      oper: params.oper
    }
  })
}

/* 修改登陆密码 */
function updatePwd (params) {
  return request({
    url: url + 'user/updatePwd',
    method: 'post',
    data: {
      phoneNum: params.phoneNum,
      oldPwd: params.oldPwd,
      newPwd: params.newPwd,
      confirmPwd: params.confirmPwd,
      userType: params.userType,
      userId: params.userId,
      oper: params.oper
    }
  })
}
export {
  sendSms,
  custRegist,
  updateAccount,
  updatePwd
}
