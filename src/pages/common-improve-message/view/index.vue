<template>
<div class="">
    <grid :show-lr-borders="false" :show-vertical-dividers="false" v-show="userType===1">
      <grid-item>
        <div class="idcard-box">
          <img :src="idCardPositionBase64 || iconIdcardPositive">
        </div>
      </grid-item>
      <grid-item>
        <div class="idcard-box">
          <img :src="idCardReverseBase64 || iconIdcardReverse">
        </div>
      </grid-item>
    </grid>
    <div class="box-wrap">
        <div><submit-item :value="name" :can-disable="true"></submit-item></div>
        <div><submit-item :left-icon="iconIdCard"  placeholder="请输入本人身份证号" :value="idCard" :can-disable="true"></submit-item></div>
    </div>
</div>
</template>
<script>
import { Grid, GridItem, XButton } from 'vux'
import {queryRealNameInfo} from '@/api/personalCenter'
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
    methods: {
        // 查询用户实名信息
        getRealNameInfo () {
            let _self = this
            queryRealNameInfo().then(function (data) {
                if (data && parseInt(data.ret) === 0) {
                    _self.idCardPositionBase64 = data.data.identityCardZImg
                    _self.idCardReverseBase64 = data.data.identityCardFImg
                    _self.name = data.data.realName
                    _self.idCard = data.data.idNumber
                }
            })
        }
    },
    mounted () {
        let getUserInfoStr = localStorage.getItem('getUserInfo')
        let getUserInfo = JSON.parse(getUserInfoStr)
        if (getUserInfo) {
            this.userType = parseInt(getUserInfo.userType)
        }
        this.getRealNameInfo()
        Native.NUI.setHeader({
            title: '个人信息',
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
