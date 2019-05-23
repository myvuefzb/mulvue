<template>
  <div class="result">
    <div class="result-content">
      <img :src="tipIcon" alt="">
      <h3>{{tip}}</h3>
    </div>
    <div class="btn-wrap" v-if="userType === 1">
      <x-button class="opt-btn"  type="default"  @click.native="goPage()" v-if="type === 'improve'">去借钱</x-button>
      <x-button class="opt-btn"  type="default"  @click.native="goPage()" v-else>返回首页</x-button>
    </div>
    <div class="btn-wrap" v-else>
      <x-button class="opt-btn"  type="default"  @click.native="goSaleRecommend()">去赚钱</x-button>
    </div>
  </div>
</template>
<script>
/*eslint-disable */
import iconSuccess from '@/assets/icon/icon-success.png'
import iconError from '@/assets/icon/icon-error.png'
import iconDeal from '@/assets/icon/icon-dealing.png'
import { XButton } from 'vux'
import Native from '@/common/native'
import {getParameter} from '@/utils/index'
import { constants } from 'crypto';
export default {
  name: 'Result',
    components: {
      XButton
    },
    data () {
      return {
        iconSuccess,
        iconError,
        iconDeal,
        type: '',
        status: '',
        returnPath: '',
        userType: 1
      }
    },
    computed: {
      tip () {
        if (this.type === 'paymeny' && parseInt(this.status) === 0) {
          return '付款成功'
        } else if (this.type === 'paymeny' && parseInt(this.status) === 4010) {
          return '付款处理中，请不要重复支付 去支付订单中查看'
        } else if (this.type === 'paymeny' && parseInt(this.status) === 4120) {
          return '付款失败'
        } else if (this.type === 'card' && parseInt(this.status) === 0) {
          return '绑卡成功'
        } else if (this.type === 'improve' && parseInt(this.status) === 0) {
          return '您已进行实名验证'
        } else {
          return '成功'
        }
      },
      tipIcon () {
        if (this.type === 'paymeny' && parseInt(this.status) === 0) {
          return this.iconSuccess
        } else if (this.type === 'paymeny' && parseInt(this.status) === 4010) {
          return this.iconDeal
        } else if (this.type === 'paymeny' && parseInt(this.status) === 4120) {
          return this.iconError
        } else if (this.type === 'card' && parseInt(this.status) === 0) {
          return this.iconSuccess
        } else if (this.type === 'improve' && parseInt(this.status) === 0) {
          return this.iconSuccess
        } else {
          return this.iconSuccess
        }
      }
    },
    methods: {
      goPage: function () {
        if (this.type === 'improve') {
          if (this.returnPath) {
            Native.NRouter.open({ 'url':this.returnPath})
          } else {
            Native.NRouter.openNative({
              url: 'Product',
              tag: 'Product'
            })
          }
        } else if (this.type === 'paymeny') {
          Native.NRouter.openNative({
            url: 'Mine',
            tag: 'Mine'
          })
        } else if (this.type === 'card') {
          Native.NRouter.openNative({
            url: 'Mine',
            tag: 'Mine'
          })
          // Native.NRouter.open({ url:'common-bank-card.html'})
        }
      },
      // 去赚钱
      goSaleRecommend: function () {
        // Native.NRouter.open({ 'url': 'sale-recommend.html'})
        Native.NRouter.openNative({
          url: 'Product',
          tag: 'Product'
        })
      }

    },
    mounted () {
      // 获取用户
      let getUserStr = localStorage.getItem('getUserInfo')
      let user = JSON.parse(getUserStr)
      if (user) {
        this.userType = parseInt(user.userType)
      }
      // 接收传递过来的类型，状态，返回的url
      this.type = getParameter('type')
      this.status = getParameter('status')
      this.returnPath = getParameter('returnPath')
      this.title = getParameter('title')
      console.log("获取到的title:" + this.title)
      Native.NUI.setHeader({
        title: this.title || '结果',
        isBack: false,
        isHide: true
      })
    }
}
</script>
<style lang="less" scoped>
  .result-content {
    margin: 100px;
    text-align: center;
    img {
      width: 180px;
      height: 180px;
    }
    h3 {
      margin-top: 80px;
      height:42px;
      line-height:42px;
      font-size:30px;
      font-weight:400;
      color:#000;
    }
  }
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
</style>

