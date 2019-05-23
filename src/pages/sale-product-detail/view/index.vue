<!-- 产品详情页 -->
<template>
  <section class="product">
    <header class="product-header clear">
      <div class="header-left">
        <div class="product-icon">
          <img :src="productDetail.logoUrl" alt="">
        </div>
        <h2 class="product-name">{{productDetail.productName}}</h2>
      </div>
      <div class="product-tips">
        <!--<flexbox :gutter="0" justify="space-between">
          <flexbox-item :span="2/5"><div class="product-tip"><label>担保方式:</label><span>{{productDetail.guaranteeMethod}}</span></div></flexbox-item>
          <flexbox-item :span="3/10"><div class="product-tip"><label>最高额度:</label><strong>{{productDetail.maxLoanAmt}}万</strong></div></flexbox-item>
          <flexbox-item :span="3/10"><div class="product-tip"><label>贷款期限:</label><span>{{productDetail.repayTerm}}</span></div></flexbox-item>
        </flexbox>-->
        <ul class="product-tip-list">
          <!--<li class="product-tip"><label>担保方式:</label><span>{{productDetail.guaranteeMethod}}</span></li>-->
          <li class="product-tip"><label>贷款利率:</label><strong>{{productDetail.minYearRate}}至{{productDetail.maxYearRate}}</strong></li>
          <li class="product-tip"><label>贷款期限:</label><strong>{{productDetail.repayTerm}}</strong></li>
          <li class="product-tip"><label>最高额度:</label><strong>{{productDetail.maxLoanAmt}}万</strong></li>
        </ul>
      </div>
    </header>
    <section class="product-content">
      <div class="content">
        <h5>产品特征</h5>
        <div class="content-detail" v-html="productDetail.productFeatures">
        </div>
      </div>
      <div class="content">
        <h5>适用对象</h5>
        <div class="content-detail" v-html="productDetail.suitable">
        </div>
      </div>
      <div class="content" v-if="productDetail.commissionRate">
        <h5>佣金规则</h5>
        <div class="content-detail" v-text="productDetail.commissionRate">
        </div>
      </div>
    </section>
    <div class="btns">
      <flexbox class="btns-list" :gutter="0">
        <flexbox-item :span="1/2"><a class="btn-apply" @click="applyLoan">去申请</a></flexbox-item>
        <flexbox-item :span="1/2"><a class="btn-share" @click="shareHandle">分享给好友</a></flexbox-item>
      </flexbox>
    </div>
    <div class="share-dialog-wrapper" v-show="shareShow">
      <div class="share-dialog-bg" @click="shareHidden"></div>
      <div class="share-dialog">
        <h3>下载app</h3>
        <p>请到应用商城下载:<span>{{appName}}</span><br/>并在APP内继续操作</p>
        <flexbox class="share-dialog-btns" :gutter="0">
          <flexbox-item><a @click="shareHidden" href="javascript:;">取消</a></flexbox-item>
          <flexbox-item><a id="copy" :data-clipboard-text="appName" href="javascript:;">复制应用名称</a></flexbox-item>
        </flexbox>
      </div>
    </div>
  </section>
</template>

<script>
/*eslint-disable */
  import { Flexbox, FlexboxItem } from 'vux'
  import {getProductDetail, getPlaceOrder} from '@/api/product'
  import {getShareProduct} from '@/api/wechat'
  import Native from '@/common/native.js'
  import {getParameter} from '@/utils/index'
  import Clipboard from 'clipboard'
  let clipboard = null
  export default {
    name: 'ProductDetail',
    components: {
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        guideShow: false,
        productDetail: {},
        shareShow: false,
        appName: '',
        /* 分享数据 */
        shareData: null,
        /* 用户信息 */
        userInfo: JSON.parse(localStorage.getItem('getUserInfo'))
      }
    },
    computed: {
      userIsRealname() {
        /* 如果用户信息不存在，则是游客 */
        if (!this.userInfo || !this.userInfo.unionUserId) {
          return false
        } else {
          return true
        }
      }
    },
    created () {
      /* 获取产品信息 */
      this.getProductDetailData(getParameter('productNo'))
      /* 如果实名认证，则分享 */
      /* 微信js-sdk权限验证 */
      // this.sdkAuthorization()
      /* 设置头部 */
      Native.NUI.setHeader({
        title: '产品介绍页',
        isBack: true
      })
    },
    beforeDestroy () {
      clipboard && clipboard.destroy()
    },
    methods: {
      /* 获取分享链接 */
      async getShareUrl (productNo, title, logoUrl) {
        const _self = this
        let params = {
          unionUserId: this.userInfo.unionUserId,
          productNo: productNo,
          // redirectUri: window.location.href,
          redirectUri: 'http://font.tekuaikeji.com:17081/loan/#/productDetail'+ '?productNo=' + productNo + '&unionUserId=' + this.userInfo.unionUserId+ '?&',
          title: title,
          imgUrl: logoUrl
        }
        Native.NUI.loading({
          text: '加载中...'
        })
        let data = await getShareProduct(params)
        Native.NUI.loadFinish()
        if (data && data.ret === '0') {
          this.shareData = data.data
        } else {
          Native.NUI.tip({
            text: data.message
          })
        }
      },
      /* 获取产品详情 */
      async getProductDetailData (productNo) {
        let params = {
          productNo: productNo
        }
        Native.NUI.loading({
          text: '加载中...'
        })
        let data = await getProductDetail(params)
        Native.NUI.loadFinish()
        if (data && data.ret === '0') {
          this.productDetail = data.data
          /*Native.NUI.setHeader({
            title: data.data.productName
          })*/
          /* 设置分享内容 */
          if (this.userIsRealname) { // 是否认证
            this.getShareUrl(productNo, this.productDetail.productName, this.productDetail.logoUrl)
          }
        } else {
          Native.NUI.tip({
            text: data.message
          })
        }
      },
      /* 用户申请贷款产品接口 */
      async getPlaceOrderData (productNo) {
        const self = this
        let params = {
          productNo: productNo
        }
        Native.NUI.loading({
          text: '加载中...'
        })
        let data = await getPlaceOrder(params)
        Native.NUI.loadFinish()
        if (data && data.ret === '0') {
          console.log(data.data.firstTrialUrl) // 链接
          console.log(data.data.firstTrialHint) // 链接
          if (data.data.firstTrialUrl) {
            window.location.href = data.data.firstTrialUrl
          } else if (data.data.firstTrialHint) {
            this.shareShow = true
            this.appName = data.data.firstTrialHint
            clipboard = new Clipboard('#copy')
            clipboard.on('success', function (e) {
              Native.NUI.tip({
                text: '地址已经复制'
              })
              e.clearSelection()
            })
            clipboard.on('error', function (e) {
              Native.NUI.tip({
                text: '地址复制失败'
              })
            })
          }
          // this.productDetail = data.data
        } else {
          Native.NUI.tip({
            text: data.message
          })
        }
      },
      /* 隐藏申请弹窗 */
      shareHidden () {
        this.shareShow = false
      },
      /* 点击分享按钮事件方法 */
      shareHandle () {
        console.log("sale share")
        if (!this.userInfo.userId) { // 如果未登录
          Native.NRouter.openNative({
            url: 'Register',
            tag: 'Register'
          })
        } else {
          if (!this.userIsRealname) {
            Native.NRouter.open({
              url: 'common-improve-message.html#/firstStep'
            })
          } else {
            console.log('详情分享')
            console.log(this.shareData)
            Native.NUI.share({
              title: this.shareData.title,
              image: this.shareData.imgUrl,
              content: this.shareData.desc,
              url: this.shareData.link
            })

          }
        }
      },
      /* 点击去申请，回调事件方法 */
      async applyLoan () {
        if (!this.userInfo.userId) { // 如果未登录
          Native.NRouter.openNative({
            url: 'Register',
            tag: 'Register'
          })
        } else {
          if (!this.userIsRealname) {
            Native.NRouter.open({
              url: 'common-improve-message.html#/firstStep'
            })
          } else {
            this.getPlaceOrderData(getParameter('productNo'))
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@/styles/variables.less';
  .product {
    min-height: 100%;
    background-color: #fff;
  }
  .product-header {
    height: 246px;
    padding-top: 60px;
    text-align: center;
    color:#fff;
    background-color: @themeColor;
  }
  .header-left {
    float: left;
    margin-left: 20px;
    width: 30%;
    text-align: center;
  }
  .product-icon {
    img {
      width: 128px;
      height: 128px;
      border-radius: 50%;
    }
  }
  .product-name {
    margin-top: 10px;
    height:42px;
    line-height:42px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size:30px;
    font-weight:400;

  }
  .product-tips {
    float: left;
    margin-left: 100px;
    text-align: left;
  }
  .product-tip {
    margin-bottom: 40px;
    height:37px;
    line-height:37px;
    font-size:26px;
    font-weight:600;
    strong {
      color: #FBC56E;
    }
  }
  .product-content {
    margin-top: 14px;
  }
  .content {
    margin-bottom: 44px;
    h5 {
      position: relative;
      padding-left: 20px;
      height:28px;
      line-height:28px;
      font-size:20px;
      font-weight:400;
      color:#7D7D7D;

    }
    h5:before {
      position: absolute;
      left: 0;
      top: 5px;
      content: ' ';
      width:10px;
      height:18px;
      background:#C81722;
    }
    .content-detail {
      margin-top: 20px;
      padding:0 20px;
      line-height:30px;
      word-break:break-all;
      font-size:22px;
      font-weight:400;
      color:#4A4A4A;
    }
  }
  .btns {
    margin-top: 100px;
  }
  .btns-list {
    a {
      display: block;
      width: 242px;
      margin: 0 auto;
      height:60px;
      line-height: 60px;
      text-align: center;
      font-size:26px;
      font-weight:400;
      border-radius:43px;
    }
    .btn-apply {
      background-color: #C81722;
      color: #FFF;
    }
    .btn-share {
      color: #C81722;
      box-sizing: border-box;
      border: 1px solid #C81722;
    }
  }
  .share-dialog-wrapper,.share-dialog-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .share-dialog-bg {
    position: absolute;
    background-color:#000;
    opacity:0.4044;
  }
  .share-dialog {
    position: absolute;
    left: 10%;
    top: 50%;
    margin-top: -178px;
    width: 80%;
    padding-bottom: 120px;
    text-align: center;
    background-color: #fff;
    border-radius:13px;
    h3 {
      padding-top: 30px;
      height:42px;
      line-height:42px;
      font-size:30px;
      font-weight:400;
      color: #A50000;
    }
    p {
      margin-top: 40px;
      padding: 0 35px;
      min-height: 80px;
      line-height:40px;
      word-wrap:break-word;
      letter-spacing:2px;
      font-size:28px;
      font-weight:400;
      color:#4A4A4A;
    }
    .share-dialog-btns {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 94px;
      background-color: #EEE;
      border-bottom-left-radius: 13px;
      border-bottom-right-radius: 13px;
      a {
        display: block;
        line-height:94px;
        text-align: center;
        font-size:30px;
        font-weight:600;
        color:#7D7D7D;
        letter-spacing:2px;
      }
      a#copy {
        border-left: 2px solid #DDDCDC;
        color: #A50000;
      }
    }
  }
</style>
