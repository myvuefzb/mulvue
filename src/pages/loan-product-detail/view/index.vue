<!-- 产品详情页 -->
<template>
  <div>
    <section class="product">
      <header class="product-header clear">
        <div class="header-left">
          <div class="product-icon">
            <img :src="productDetail.logoUrl" alt="">
          </div>
          <h2 class="product-name">{{productDetail.productName }}</h2>
        </div>
        <div class="product-tips">
          <ul class="product-tip-list">
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
      </section>
      <div class="btns">
        <flexbox class="btns-list" :gutter="0">
          <flexbox-item :span="1/2" @click.native="appliceProduct(productDetail)"><a class="btn-apply" href="javascript:;">去申请</a></flexbox-item>
          <flexbox-item :span="1/2"><a class="btn-share" @click="shareHandle()" href="javascript:;">分享给好友</a></flexbox-item>
        </flexbox>
      </div>
    </section>
    <div class="reset-confirm" v-transfer-dom>
      <confirm
        v-model="showConfirmFlag"
        title='下载APP'
        confirm-text="复制应用名称"
        @on-confirm="onConfirmCopy">
          <div><p>请到应用商城下载:<span v-html="copyContext"></span></p><p>并在APP内继续操作</p></div>
        </confirm>
    </div>
  </div>
</template>

<script>
/*eslint-disable */
import { Flexbox, FlexboxItem, Confirm, TransferDomDirective as TransferDom } from 'vux'
  import {getProductDetail, placeorder} from '@/api/product'
  import {getLoanShareProduct} from '@/api/wechat'
  import Native from '@/common/native.js'
  import {getParameter} from '@/utils/index'
  import { copy } from 'iclipboard'
  export default {
    name: 'ProductDetail',
    directives: {
      TransferDom
    },
    components: {
      Flexbox,
      FlexboxItem,
      Confirm
    },
    data () {
      return {
        guideShow: false,
        productNo: '',
        unionUserId: '',
        productDetail: {},
        showConfirmFlag: false,
        copyContext: '',
        shareData:'',
        userInfo: JSON.parse(localStorage.getItem('getUserInfo'))
      }
    },
    computed: {
      userIsRealname() {
        /* 如果用户信息不存在，则是游客 */
        if (this.userInfo && !this.userInfo.unionUserId) {
          return false
        } else {
          return true
        }
      }
    },
    mounted () {
      if (getParameter('unionUserId')) {
        localStorage.setItem('saleUnionUserId', getParameter('unionUserId'))
        if (getParameter('productNo')) {
          localStorage.setItem('fromSaleProductNo', getParameter('productNo'))
        }
      }
      this.unionUserId = getParameter('unionUserId')
      this.productNo = getParameter('productNo')
      this.getProductDetailData(this.productNo)
      /* 设置头部 */
      Native.NUI.setHeader({
        title: '产品介绍页',
        isBack: true
      })
    },
    methods: {
      /* 获取分享链接 */
      async getShareUrl (productId, title, imgUrl) {
        // const _self = this
        // let h = '#/productDetail?productNo=' + this.productNo
        let host = 'http://font.tekuaikeji.com:17081/loan/#/product?&'
        let params = {
          unionUserId: this.unionUserId,
          productNo: productId,
          redirectUri: host,
          title: title,
          imgUrl: imgUrl
        }
        let data = await getLoanShareProduct(params)
        if (data && data.ret === '0') {
          this.shareData = data.data
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: data.message
          })
        }
      },
      // 获取产品详情
      getProductDetailData (productId) {
        let _self = this
        let params = {
          productNo: productId
        }
        _self.$vux.loading.show()
        getProductDetail(params).then(function (data) {
          _self.$vux.loading.hide()
          if (data && parseInt(data.ret) === 0) {
            _self.productDetail = data.data
            console.log(_self.productDetail)
            _self.getShareUrl(productId, _self.productDetail.productName, _self.productDetail.logoUrl)
          // if (this.userIsRealname) { // 是否认证
          //   _self.getShareUrl(productId, _self.productDetail.productName, _self.productDetail.logoUrl)
          // }
          } else {
            _self.$vux.toast.show({
              type: 'text',
              text: data.message
            })
          }
        })
      },
      /* 用户申请贷款产品接口 */
      async getPlaceOrderData (productNo) {
        let _self = this
        let params = {
          salesManId: localStorage.getItem('saleUnionUserId'),
          productNo: this.productNo
        }
        console.log("开始申请")
        Native.NUI.loading({
          text: '加载中...'
        })
        // _self.$vux.loading.show()
        let data = await placeorder(params)
        Native.NUI.loadFinish()
        console.log("开始申请请求结束")
        console.log("申请借款成功结果值："+ parseInt(data.ret))
        console.log("需要复制的内容："+ data.data.firstTrialHint)
        // _self.$vux.loading.hide()
        if (data &&  parseInt(data.ret) === 0) {
          if (data.data.firstTrialUrl) {
            window.location.href = data.data.firstTrialUrl
          } else if (data.data.firstTrialHint) {
            console.log(data.data.firstTrialHint)
            _self.copyContext = data.data.firstTrialHint
            _self.showConfirmFlag = true
            console.log(_self.showConfirmFlag)
          }
        } else {
          Native.NUI.tip({
            text: data.message
          })
        }
      },
      // 显示复制框
      onConfirmCopy: function () {
        let _self = this
        copy(_self.copyContext)
        _self.$vux.toast.show({
          type: 'text',
          text: '复制成功'
        })
        _self.showConfirmFlag = false
      },
      // 去申请
      appliceProduct: function () {
        let _self = this
        if (this.userInfo && !this.userInfo.userId) { // 如果未登录
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
            console.log("申请")
            _self.getPlaceOrderData(_self.productNo)
          }
        }
      },
      /* 点击分享按钮事件方法 */
      shareHandle () {
        console.log("share")
        // let img= 'https://hxyl-dc-apk.oss-cn-shenzhen.aliyuncs.com/dcAdmin/dcAdmin_productLogo/20190423/20190423152812_l8t0lveyb3.png'
        //  Native.NUI.share({
        //     title: 'Test',
        //     image: img,
        //     content: '产品内容',
        //     url: 'http://www.baidu.com'
        //   })
        if (this.userInfo && !this.userInfo.userId) { // 如果未登录
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
            console.log('begin shared')
            Native.NUI.share({
              title: this.shareData.title,
              image: this.shareData.imgUrl,
              content: this.shareData.desc,
              url: this.shareData.link
            })
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
