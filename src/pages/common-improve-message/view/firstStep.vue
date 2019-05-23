<template>
<div class="">
    <grid :show-lr-borders="false" :show-vertical-dividers="false" v-show="userType===1">
      <grid-item @click.native="photoHandle('position')">
        <div class="idcard-box">
          <img :src="idCardPositionBase64 || iconIdcardPositive">
        </div>
      </grid-item>
      <grid-item @click.native="photoHandle('reverse')">
        <div class="idcard-box">
          <img :src="idCardReverseBase64 || iconIdcardReverse">
        </div>
      </grid-item>
    </grid>
    <div class="box-wrap">
        <div><submit-item :value="name" :input-change="nameInputChange" @updateValue="getNameValue"></submit-item></div>
        <div><submit-item :left-icon="iconIdCard"  placeholder="请输入本人身份证号" :value="idCard" :input-change="idCardInputChange"  @updateValue="getIdCardValue" :show-right-icon="userType !== 1" :right-icon-event-callback="photoHandle"></submit-item></div>
        <div class="btn-wrap"><x-button class="opt-btn" :class="{'disabledClass':submitIsDisabled}" type="default" :disabled="submitIsDisabled" @click.native="submit()">下一步</x-button></div>
    </div>
</div>
</template>
<script>
import { Grid, GridItem, XButton } from 'vux'
import {recognition, isRealName} from '@/api/personalCenter'
import REGULAR from '@/utils/regular.js'
import iconIdCard from '@/assets/icon/icon-idcard@2x.png'
import iconIdcardPositive from '@/assets/icon/idcard-positive-icon.png'
import iconIdcardReverse from '@/assets/icon/idcard-reverse-icon.png'
import submitItem from '@/components/submitItem.vue'

import Native from '@/common/native'
export default {
    components: {
        Grid,
        GridItem,
        XButton,
        submitItem
    },
    data () {
        return {
            iconIdCard,
            iconIdcardPositive,
            iconIdcardReverse,
            idCardPositionBase64: '',
            idCardReverseBase64: '',
            name: '', // 姓名
            idCard: '', // 身份证号码
            userType: 1 // 1借款人，0业务员
        }
    },
    computed: {
        // 提交按钮是否可用
        submitIsDisabled () {
            if (this.userType === 1) {
                if (REGULAR.name.test(this.name) && REGULAR.idCard.test(this.idCard) && this.idCardPositionBase64 && this.idCardReverseBase64) {
                    return false
                } else {
                    return true
                }
            } else {
                if (REGULAR.name.test(this.name) && REGULAR.idCard.test(this.idCard)) {
                    return false
                } else {
                    return true
                }
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
        // 扫描
        photoHandle: function (type) {
            Native.NUI.openCamera({'callback': 'getIdCardPhotoHandle', belong: type})
        },
        getLocalImgData (localData) {
            let _self = this
            if (localData) {
                let belongType = localData.belong
                let base64Image = localData.image
                if (base64Image.indexOf('data:image') !== 0) {
                    // 判断是否有这样的头部
                    base64Image = 'data:image/jpeg;base64,' + base64Image
                }
                base64Image = base64Image.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg')
                if (belongType === 'position') {
                    _self.idCardPositionBase64 = base64Image
                    _self.getRecognition(base64Image, 'position')
                } else if (belongType === 'reverse') {
                    _self.idCardReverseBase64 = base64Image
                    _self.getRecognition(base64Image, 'reverse')
                } else {
                    _self.getRecognition(base64Image)
                }
            }
        },
        async getRecognition (attach, idCardType) {
            let params = {
                attach: attach,
                type: '2',
                cardNo: ''
            }
            this.$vux.loading.show()
            let data = await recognition(params)
            this.$vux.loading.hide()
            if (data && data.ret === '0') {
                if (idCardType === 'position') {
                    this.idCard = data.data.idcardNumber
                    this.name = data.data.name
                } else {
                    if (this.userType === 0) {
                        this.idCard = data.data.idcardNumber
                        this.name = data.data.name
                    }
                }
            } else {
                if (idCardType === 'position') {
                    this.idCardPositionBase64 = ''
                } else if (idCardType === 'reverse') {
                    this.idCardReverseBase64 = ''
                }
                this.$vux.toast.show({
                    type: 'text',
                    text: data.message
                })
            }
        },
        /* 姓名更改方法 */
        nameInput (val) {
            this.name = val
        },
        /* 身份证号更改方法 */
        idCardInput (val) {
            this.idCard = val
        },
        /* 提交方法 */
        async submit () {
            let _self = this
            if (this.submitIsDisabled) {
                return false
            }
            let storeFirstStepInfo = {
                idCardPositionBase64: _self.idCardPositionBase64,
                idCardReverseBase64: _self.idCardReverseBase64,
                idCard: _self.idCard,
                name: _self.name
            }
            localStorage.setItem('storeFirstStepInfo', JSON.stringify(storeFirstStepInfo))
            // 检查是否有另一台设备登录
            isRealName().then(function (realNamedata) {
                if (realNamedata && parseInt(realNamedata.ret) === 0) {
                    Native.NRouter.open({url: 'common-improve-message.html#/nextStep', data: {userName: _self.name.trim(), idCard: _self.idCard.trim()}})
                }
            })
        }
    },
    mounted () {
        let _self = this
        let getUserInfoStr = localStorage.getItem('getUserInfo')
        let getUserInfo = JSON.parse(getUserInfoStr)
        if (getUserInfo) {
            this.userType = parseInt(getUserInfo.userType)
        }
        let getDefaultData = localStorage.getItem('storeFirstStepInfo')
        if (getDefaultData) {
            let defaultDataObj = JSON.parse(getDefaultData)
            this.idCardPositionBase64 = defaultDataObj.idCardPositionBase64
            this.idCardReverseBase64 = defaultDataObj.idCardReverseBase64
            this.idCard = defaultDataObj.idCard
            this.name = defaultDataObj.name
        }
        window.platformAdapter.getIdCardPhotoHandle = (data) => {
            console.log(data)
            _self.getLocalImgData(data)
        }
        // 检查是否有另一台设备登录
        isRealName()
        Native.NUI.setHeader({
            title: '完善信息',
            isBack: true
        })
    }
}
</script>
<style lang='less' scoped>
  .idcard-box {
    height: 260px;
    border: dashed 1px #dcdcdc;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
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
