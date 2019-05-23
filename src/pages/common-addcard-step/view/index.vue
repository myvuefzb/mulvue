<template>
  <div class="box-wrap">
    <div><submit-item :value="name" :input-change="nameInputChange" @updateValue="getNameValue"></submit-item></div>
    <div><submit-item :left-icon="iconIdCard" :show-right-icon="true" placeholder="请输入本人身份证号" :value="idCard" :input-change="idCardInputChange"  @updateValue="getIdCardValue"  :right-icon-event-callback="photoHandle" :debounce="2000"></submit-item></div>
    <div class="btn-wrap"><x-button class="opt-btn" :class="{'disabledClass':submitIsDisabled}" type="default" :disabled="submitIsDisabled" @click.native="submit()">下一步</x-button></div>
  </div>
  
</template>
<script>
/* eslint-disable */
import { XButton } from 'vux'
import REGULAR from '@/utils/regular.js'
import {recognition} from '@/api/personalCenter'
import submitItem from '@/components/submitItem.vue'
import iconIdCard from '@/assets/icon/icon-idcard@2x.png' 
import Native from '@/common/native'
export default {
  name: 'AddBankFirstStep',
  components: {
    submitItem,
    XButton
  },
  data () {
    return {
      iconIdCard, // id card 图标
      name: '', // 姓名
      idCard: '' // 身份证号码
    }
  },
  computed: {
    /* 提交按钮是否可用 */
    submitIsDisabled () {
      if (REGULAR.name.test(this.name) && REGULAR.idCard.test(this.idCard)) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    getNameValue (val) {
      this.name = val
    },
    getIdCardValue (val) {
      this.idCard = val
    },
    nameInputChange (val) {
      if (!REGULAR.name.test(this.name)) {
        this.$vux.toast.show({
          type: 'text',
          text: '输入的姓名格式不合法'
        })
      }
    },
    idCardInputChange (val) {
      if (!REGULAR.idCard.test(this.idCard)) {
        this.$vux.toast.show({
          type: 'text',
          text: '输入的身份证号格式不合法'
        })
      }
    },
    /* 拍照方法 */
    photoHandle () {
      let _self = this
      Native.NUI.openCamera({"callback":"getPhotoHandle",belong:''})
    },
    getLocalImgData (localData) {
      let _self = this
      if (localData) {
        let base64Image = localData.image
        if (base64Image.indexOf('data:image') !== 0) {
          // 判断是否有这样的头部
          base64Image = 'data:image/jpeg;base64,' + base64Image
        }
        base64Image = base64Image.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg')
        _self.getRecognition(base64Image)
      }
    },
    async getRecognition (attach) {
      let _self = this
      let params = {
        attach: attach,
        type: '2',
        cardNo: ''
      }
      this.$vux.loading.show()
      let data = await recognition(params)
      this.$vux.loading.hide()
      if (data && data.ret === '0') {
        _self.name = data.data.name
        _self.idCard = data.data.idcardNumber
      } else {
        this.$vux.toast.show({
          type: 'text',
          text: data.message
        })
      }
    },
    /* 提交方法 */
    async submit () {
      let _self = this
      if (this.submitIsDisabled) {
        return false
      }
      let storeAddBankCardFirstStepInfo = {
        idCard: _self.idCard,
        name: _self.name
      }
      let userInfoStr = localStorage.getItem('getUserInfo')
      let userInfo = JSON.parse(userInfoStr)
      console.log("当前的用户信息，要填写相同的idNumber和realName才能通过：")
      console.log(userInfo)
      if (_self.idCard !== userInfo.idNumber || _self.name !== userInfo.realName) {
        this.$vux.toast.show({
          type: 'text',
          text: '为了保证账户资金安全，只能绑定认证用户本人的身份信息和银行卡',
          width: '9.6em'
        })
        return false
      }
      localStorage.setItem('storeAddBankCardFirstStepInfo', JSON.stringify(storeAddBankCardFirstStepInfo))
      Native.NRouter.open({url:'common-addcard-step.html#/addBankNextStep',data:{userName: _self.name.trim(), idCard: _self.idCard.trim()}})
    }
  },
  mounted () {
    let _self = this
    let getDefaultData = localStorage.getItem('storeAddBankCardFirstStepInfo')
    console.log('获取银行卡:'+localStorage.getItem('storeAddBankCardFirstStepInfo'))
    if (getDefaultData) {
      let defaultDataObj = JSON.parse(getDefaultData)
      this.idCard = defaultDataObj.idCard
      this.name = defaultDataObj.name
    } else {
      // 兼容ios
      this.idCard = ''
      this.name = ''
    }
    window.platformAdapter.getPhotoHandle = (data)=> {
      _self.getLocalImgData(data)
    }
    Native.NUI.setHeader({
      title: '添加银行卡',
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
      margin: 230px auto 0px auto;
      .disabledClass { opacity: 0.5 }
      .opt-btn {
        width:264px;
        height:100px;
        font-size: 36px;
        font-weight: 600;
        color: #fff;
      }
    }
  }
</style>

