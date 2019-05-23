/* eslint-disable */
/* 正则表达式 */
const REGULAR = {
  telphone: /^1[34578]\d{9}$/, // 手机号码
  verificationCode: /^\d{4,6}$/, // 短信验证码
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, // 密码
  noNumber: /\D+/g, // 非数字
  space: /\s/g, // 空格
  name: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/, // 姓名
  bankcard: /^([1-9])(\d{14,30})$/, // 银行卡号
  idCard: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/, // 身份证号
  // eslint-disable-next-line no-useless-escape
  money: /(^[0-9]{1,8}$)|(^[0-9]{1,8}[\.]{1}[0-9]{1,2}$)/  // 金额（整数八位，小数两位）
}
export default REGULAR
