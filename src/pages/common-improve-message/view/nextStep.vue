<template>
   <div class="box-wrap">
      <div><submit-item :left-icon="iconBankCard" :value="bankCardNo" :input-change="bankCardInputChange" @updateValue="getBankCardValue" :show-right-icon="true" :right-icon-event-callback="photoHandle" :debounce="2000" placeholder="请输入名下借记卡号"></submit-item></div>
      <div><submit-item :left-icon="iconTel"  placeholder="请输入银行卡预留手机号" :value="telphone" :input-change="telphoneInputChange" @updateValue="getPhoneValue" :get-max-length="11"></submit-item></div>
      <div class="code-box-wrap">
        <submit-item :left-icon="iconCode"  placeholder="请输入验证码" :value="validataCode" :input-change="codeInputChange" @updateValue="getCodeValue" :get-max-length="6"></submit-item>
        <div class="code-wrap">
          <div v-if="!showCounterFlag" @click="sendCode">发送验证码</div>
          <div v-else >({{counter}}s)</div>
        </div>
      </div>
      <div class="support-bank-box" @click="showSupportBanks">支持银行</div>
      <div class="btn-wrap">
        <flexbox :gutter="0">
          <flexbox-item>
            <x-button class="opt-btn pre-btn" type="default"  @click.native="goPreStep()">上一步</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button class="opt-btn" :class="{'disabledClass':submitIsDisabled}" type="default" :disabled="submitIsDisabled" @click.native="submit()">填好了</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      
      <div v-transfer-dom>
        <x-dialog v-model="showBankListDialog"  hide-on-blur :dialog-style="{'display':'block !important','max-width': '100%', width: '100%', height: '80%', 'background-color': 'transparent','text-align':'left'}">
          <div class="bank-list-wrap">
            <div class="bank-box-header">支持的银行列表</div>
            <div class="reset-wexin-cells bank-item-box">
              <group>
                <cell v-for="bank in supportBankList" :key="bank.openBank" style="padding-top: 10px;padding-bottom: 10px">
                  <img slot="icon" width="20" style="display:block;margin-right:10px;" :src="bank.logo">
                  <span slot="title" style="font-size: 13px;">{{bank.bankName}}</span>
                </cell>
              </group>
            </div>
            <div class="close-bank-box"  @click="showBankListDialog = false">知道了</div>
          </div>
        </x-dialog>
      </div>
    </div>
</template>
<script>
/* eslint-disable */ 
import { Flexbox, FlexboxItem, XDialog, TransferDomDirective as TransferDom, Group, Cell, XButton } from 'vux'
import submitItem from '@/components/submitItem.vue'
import iconTel from '@/assets/icon/icon-tel@2x.png'
import iconCode from '@/assets/icon/icon-code@2x.png'
import iconBankCard from '@/assets/icon/icon-bank-card.png'
import REGULAR from '@/utils/regular.js'
import { cardbin, preSign, supportBanks, confirmSign } from '@/api/card'
import {recognition, myCenter} from '@/api/personalCenter'
import Native from '@/common/native'
export default {
  name: 'AddBankNextStep',
  directives: {
    TransferDom
  },
  components: {
    submitItem,
    XButton,
    Flexbox,
    FlexboxItem,
    XDialog,
    Group,
    Cell
  },
  data () {
    return {
      showCounterFlag: false,
      counter: 59,
      showBankListDialog: false,
      userName: '', // 用户名
      idCard: '', // 身份证号
      supportBankList: [], // 所支持的银行卡
      iconTel,
      iconCode,
      iconBankCard,
      bankCardNo: '', // 银行卡
      telphone: '', // 手机号码
      validataCode: '', // 验证码
      bankCode: '',
      bankName: '',
      protocolNo: ''
    }
  },
  computed: {
    /* 提交按钮是否可用 */
    submitIsDisabled () {
      if (REGULAR.bankcard.test(this.bankCardNo) && REGULAR.telphone.test(this.telphone) && REGULAR.verificationCode.test(this.validataCode)) {
        return false
      } else {
        return true
      }
    },
    /* 验证码是否可发送 */
    isSendCode () {
      return !!REGULAR.telphone.test(this.telphone)
    }
  },
  methods: {
    // 开始计数
    beginCounter: function () {
      let _self = this
      if (_self.showCounterFlag) {
        let setConter = setInterval(() => {
          _self.counter--
          if (_self.counter===0) {
            clearInterval(setConter)
            _self.counter = 59
            _self.showCounterFlag = false
          }
        }, 1000)
      }
    },
    getBankCardValue: function(val) {
      this.bankCardNo = val
    },
    getPhoneValue: function (val) {
      this.telphone = val
    },
    getCodeValue: function (val) {
      this.validataCode = val
    },
    bankCardInputChange: function (val) {
      if (!REGULAR.bankcard.test(this.bankCardNo)) {
        this.$vux.toast.show({
          type: 'text',
          text: '输入的借记卡号格式不合法'
        })
      }
    },
    telphoneInputChange: function (val) {
      if (!REGULAR.telphone.test(this.telphone)) {
        this.$vux.toast.show({
          type: 'text',
          text: '输入的手机号码格式不合法'
        })
      }
    },
    codeInputChange: function (val) {
      if (!REGULAR.verificationCode.test(this.validataCode)) {
        this.$vux.toast.show({
          type: 'text',
          text: '输入的验证码格式不合法'
        })
      }
    },
    showSupportBanks: function () {
      this.showBankListDialog = true
    },
    getSupportBanks: function () {
      let _self = this
      supportBanks().then(function (data) {
        if (data && data.data && data.data.bankList) {
          _self.supportBankList = data.data.bankList
        }
      }, function (error) {
        console.log(error)
      })
    },
    /* 发送验证码方法 */
    sendCode () {
      let _self = this
      if (!REGULAR.bankcard.test(this.bankCardNo)) {
        this.$vux.toast.show({
          type: 'text',
          text: '银行卡号输入有误'
        })
        return false
      }
      _self.$vux.loading.show()
      cardbin({'cardNo': _self.bankCardNo}).then(function (data) {
        _self.$vux.loading.hide()
        if (data && data.data && parseInt(data.ret) === 0) {
          if (parseInt(data.data.cardType) !== 2) {
            _self.$vux.toast.show({
              type: 'text',
              text: '信用卡不能绑定'
            })
            return false
          }
          let queryBankCode = data.data.bankCode
          let queryBankCodeFlag = false
          _self.bankName = data.data.bankName
          _self.bankCode = data.data.bankCode
          if (_self.supportBankList && _self.supportBankList.length) {
            for (let i = 0; i < _self.supportBankList.length; i++) {
              let bank = _self.supportBankList[i]
              if (bank.openBank === queryBankCode) {
                queryBankCodeFlag = true
              }
            }
          }
          // 是否是已支持的银行卡
          if (queryBankCodeFlag) {
            let postData = {
              'cardNo': _self.bankCardNo,
              'userName': _self.userName,
              'telephone': _self.telphone,
              'idcard': _self.idCard,
              'bankcode': queryBankCode
            }
            // preSign
            preSign(postData).then(function (data) {
              if (data && parseInt(data.ret) === 0) {
                _self.showCounterFlag = true
                _self.beginCounter()
                _self.$vux.toast.show({
                  type: 'text',
                  text: '验证码发送成功'
                })
                _self.protocolNo = data.data.protocolNo
              } else {
                _self.$vux.toast.show({
                  type: 'text',
                  text: data.message
                })
              }
            })
          } else {
            _self.$vux.toast.show({
              type: 'text',
              text: '暂不支持该银行'
            })
          }
        } else {
          _self.$vux.toast.show({
            type: 'text',
            text: data.message
          })
        }
      })
    },
    /* 银行卡号拍照事件方法 */
    photoHandle () {
      let _self = this
      Native.NUI.openCamera({"callback":"getIdNumberPhotoHandle", belong: ''})
    },
    getIdNumberLocalImgData: function (localData) {
      let _self = this
      if (localData) {
          let belongType = localData.belong
          let base64Image = localData.image
          if (base64Image.indexOf('data:image') !== 0) {
          // 判断是否有这样的头部
          base64Image = 'data:image/jpeg;base64,' + base64Image
          }
          base64Image = base64Image.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg')
          console.log("getRecognition开始orc扫描上传")
          _self.uploadRecognition(base64Image)
        }
    },
    uploadRecognition: function (attach) {
      let _self = this
      let params = {
        attach: attach,
        type: '3',
        cardNo: ''
      }
      _self.$vux.loading.show()
      recognition(params).then(function(data) {
        _self.$vux.loading.hide()
        if (data && data.ret === '0') {
          _self.bankCardNo = data.data.cardNo.replace(REGULAR.space, '')
        } else {
          _self.$vux.toast.show({
            type: 'text',
            text: data.message
          })
        }
      })
      
    },
    /* 验证码更改方法 */
    codeInput (val) {
      this.validataCode = val
    },
    // 上一步
    goPreStep () {
      Native.NRouter.back()
    },
    // 更新用户信息
    async upDateUserInfo () {
      let data = await mycenter()
      if (data && data.ret === '0') {
        let userStr = localStorage.getItem('getUserInfo')
        let user = JSON.parse(userStr)
        if (user) {
          let info = data.data
          user.accessToken = info.accessToken
          user.account = info.account
          user.idNumber = info.idNumber
          user.openId = info.openId
          user.phone = info.phone
          user.realName = info.realName
          user.roleCode = info.roleCode
          user.roleName = info.roleName
          user.status = info.status
          user.storeId = info.storeId
          user.unionUserId = info.unionUserId
          user.userId = info.userId
          user.userType = info.userType
          localStorage.setItem('getUserInfo',JSON.stringify(user))
          Native.NRouter.refreshUserInfo(user)
        }
      } else {
        this.$vux.toast.show({
          type: 'text',
          text: data.message
        })
      }
    },
    /* 提交方法 */
    submit () {
      if (this.submitIsDisabled) {
        return false
      }
      if (!REGULAR.bankcard.test(this.bankCardNo)) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入合法的借记卡号'
        })
        return false
      }
      if (!REGULAR.telphone.test(this.telphone)) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入合法的手机号码'
        })
        return false
      }
      if (!REGULAR.verificationCode.test(this.validataCode)) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入合法的验证码'
        })
        return false
      }
      let _self = this
      let postData = {
        'cardNo': _self.bankCardNo,
        'userName': _self.userName,
        'telephone': _self.telphone,
        'idcard': _self.idCard,
        'bankcode': _self.bankCode,
        'channelType': '1',
        'smsVrifyCode': _self.validataCode, // 短信验证码
        'protocolNo': _self.protocolNo, // 签约唯一码
        'bankName': _self.bankName
      }
      confirmSign(postData).then(function (data) {
        if (data && parseInt(data.ret) === 0) {
          localStorage.setItem('storeFirstStepInfo', '')
          let fromSaleProductNo = localStorage.getItem('fromSaleProductNo')
          let saleUnionUserId = localStorage.getItem('saleUnionUserId')
          let returnPath = ''
          if (fromSaleProductNo && saleUnionUserId) {
            returnPath = 'loan-product-detail.html#/index?productNo=' + fromSaleProductNo + '&unionUserId=' + saleUnionUserId
          }
          console.log("开始调用原生方法更新用户数据")
          _self.upDateUserInfo()
          console.log("开始调用原生方法更新用户数据结束，开始跳转")
          Native.NRouter.open({url:'common-result.html', data:{title:'完善信息结果', type:'improve', status: data.data.status,  returnPath: returnPath}})
          console.log("开始调用原生方法更新用户数据结束，开始跳转结束")
        } else {
          _self.$vux.toast.show({
            type: 'text',
            text: data.message,
            width: '80em'
          })
        }
      })
    },
  },
  mounted () {
    let _self = this
    this.userName = this.$route.query.userName
    this.idCard = this.$route.query.idCard
    this.getSupportBanks()
    window.platformAdapter.getIdNumberPhotoHandle = (data)=> {
      console.log("get camera data success")
        _self.getIdNumberLocalImgData(data)
      }
    Native.NUI.setHeader({
        title: '完善信息',
        isBack: true,
        isBack: true
    })
  }
}
</script>
<style lang="less" scoped>
.box-wrap {
  height: 100%;
  background-color: #f9f9f9;
  padding-top: 82px;
  padding-left: 20px;
  padding-right: 20px;
  .btn-wrap {
    margin: 200px auto 0px auto;
    .disabledClass { opacity: 0.5 }
    .opt-btn {
      width:264px;
      height:100px;
      font-size: 36px;
      font-weight: 600;
      color: #fff;
    }
    .opt-btn.pre-btn {
      color: @default;
      background-color: #fff;
      border-color: @default;
    }
    .opt-btn.pre-btn::after {
      border-color: @default;
    }
  }
}
.code-box-wrap {
  position: relative;
  padding-right: 196px;
  .code-wrap {
    position: absolute;
    right: 0;
    top: 0;
    width: 196px;
    height: 80px;
    line-height: 80px;
    font-size: 30px;
    text-align: center;
    background-color: #fff;
    border-left: solid 1px #dcdcdc;
    color: #A50000;
  }
}
.support-bank-box {
  padding: 24px;
  text-align: right;
  color: #5BA2FC;
  font-size: 28px;
}
.bank-item-box {
  overflow: scroll;
}
.bank-list-wrap {
  display: flex;
  flex-flow: column;
  height: 100%;
  width: 80%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 6px;
  .bank-box-header {
    height: 70px;
    line-height: 70px;
    text-align: center;
    color: #222222;
    font-size: 30px;
    font-weight: bolder;
  }
  .close-bank-box {
    color: @default;
    font-size: 26px;
    height: 66px;
    width: 100%;
    border-top: solid 1px #dcdcdc;
    line-height: 66px;
    text-align: center;
    background-color: #fff;
  }
}
.button-list {
  margin-top: 230px;
  text-align: center;
  .prev-step {
    display: block;
    width:264px;
    height:100px;
    margin: 0 auto;
    line-height: 100px;
    text-align: center;
    font-size:36px;
    color: #A50000;
    font-weight:400;
    border-radius:6px;
    border:1px solid #A50000;

  }
  button {
    display: block;
    width: 264px;
    height:100px;
    margin: 0 auto;
    line-height: 100px;
    text-align: center;
    font-size:36px;
    font-weight:600;
    color: #ffffff;
    background-color:@default;
    border-radius:6px;
    border: 0 none;
  }
  button:disabled {
    background-color:@disable;
  }
}
</style>

