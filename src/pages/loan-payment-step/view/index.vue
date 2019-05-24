<template>
  <div style="overflow: hidden;position:fixed;width: 100%;height: 100%;top:0;">
    <div class="my-box-wrap">
      <h4 class="pay-title">支付金额</h4>
      <div class="write-num-box">
        <span class="money-icon">¥</span>
        <input class="num" placeholder="请输入金额" type="number" v-model.trim="money"  @input="changeValue()"/>
      </div>
    </div>
    <div class="next-btn-wrap" v-show="hadPopup">
      <x-button class="next-btn"  type="default" :disabled="nextBtnFlag"  @click.native="showSelectItems()">下一步</x-button >
    </div>
    <div v-transfer-dom>
      <popup v-model="showNextStepPopup" :hide-on-blur= "false" position="bottom" max-height="50%">
        <div class="popup-content-box">
          <div class="header-box" @click="hideNextStep()"><span>确认付款</span><img class="close-icon" src="@/assets/icon/close-icon.png" alt="" /></div>
          <group class="reset-wexin-cells">
            <cell-box class="cell-wrap">
              <div class="pay-num"><span>¥</span><span>{{formatMoney}}</span></div>
            </cell-box>
            <cell is-link class="cell-wrap" @click.native="goSelectCard()">
              <span slot="title" class="left-title">选择银行卡</span>
              <span slot="value" class="right-value">{{reSetBankName(defaultCard)}}</span>
            </cell>
            <cell is-link  class="cell-wrap" @click.native="goSelectProduct()">
              <span slot="title" class="left-title">选择产品</span>
              <span slot="value" class="right-value">{{defaultProduct.productName || '请选择产品' }}</span>
            </cell>
          </group>
          <div class="next-btn-box">
            <x-button class="next-btn" type="default" :disabled="sendMessageCodeFlag"  @click.native="sendMsg()">下一步</x-button >
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSelectCardPopup" :hide-on-blur= "false" position="bottom" max-height="50%">
        <div class="popup-content-box">
          <div class="header-box" @click="hadSelectedCard()"><span>选择银行卡</span><img class="close-icon" src="@/assets/icon/close-icon.png" alt="" /></div>
          <group class="reset-wexin-cells">
            <cell class="cell-wrap" @click.native="hadSelectedCard(card)" v-for="card in bindCardList" :key="card.bankCode">
              <span slot="title" class="left-title left-title">{{reSetBankName(card)}}</span>
              <span slot="value" class="right-value"><img class="select-icon" src="@/assets/icon/selected-icon.png" alt="" v-show="card.defaultStatus===1" /></span>
            </cell>
            <cell class="cell-wrap" @click.native="goSelectBankCardPage()">
              <span slot="title" class="left-title">添加银行卡</span>
            </cell>
          </group>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSelectProductPopup" :hide-on-blur= "false" position="bottom" max-height="50%">
        <div class="popup-content-box">
          <div class="header-box" @click="hadSelectedProduct()"><span>选择产品</span><img class="close-icon" src="@/assets/icon/close-icon.png" alt="" /></div>
          <div class="product-input-wrap">
            <input class="product-input" placeholder="请输入产品名称" type="text" v-model.trim="productNameKeyWord" @change="searchProduct()"  @blur="fixedIOS()"  />
            <img class="search-icon" src="@/assets/icon/search-icon.png" alt=""/>
          </div>
          <scroller lock-x scrollbar-y use-pullup :use-pulldown="false" height="260px" :pullup-config="pullUpConfig"  @on-pullup-loading="loadMore" ref="scroller">
            <div>
              <group class="reset-wexin-cells">
                <cell class="cell-wrap" @click.native="hadSelectedProduct(product)" v-for="(product, $index) in bindProductList" :key="$index">
                  <span slot="title" class="left-title left-title">{{product.productName}}</span>
                  <span slot="value" class="right-value"><img class="select-icon" src="@/assets/icon/selected-icon.png" alt="" v-show="product.productName===defaultProduct.productName" /></span>
                </cell>
              </group>
              <p class="none-more" v-if="!getMoreFlag">没有更多数据</p>
            </div>
          </scroller>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSendMessagePopup" :hide-on-blur= "false" position="bottom" max-height="50%">
        <div class="popup-content-box">
          <div class="header-box" @click="hadSendMessage()"><span>确认付款</span><img class="close-icon" src="@/assets/icon/close-icon.png" alt="" /></div>
          <group class="reset-wexin-cells">
            <div class="cell-wrap">
              <div class="pay-num"><span>¥</span><span>{{formatMoney}}</span></div>
            </div>
            <div >
              <h3 class="send-phone">请查收尾号{{lastIndexPhoneNum}}手机的验证码</h3>
              <div class="send-message-wrap" >
                <input class="send-code-input" placeholder="请输入短信验证码" type="text" maxlength="6" v-model.trim="sendCodeContent"   @blur="fixedIOS()" />
                <span class="counter-wrap" v-if="counterNum>0">({{counterNum}}s)</span>
                <span class="counter-wrap" v-else @click="reSendCode()">重新发送</span>
              </div>
            </div>
          </group>
          <div class="next-btn-box">
            <x-button class="next-btn" type="default" :disabled="!sendCodeContent"  @click.native="beginRepaymentWithCode()">立即付款</x-button >
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
/*eslint-disable */
import { TransferDom, Popup, Group, Cell, CellBox, XButton, XInput, numberComma, Scroller, Spinner } from 'vux'
import REGULAR from '@/utils/regular.js'
import { bindedCards, sendMsg, repaymentWithCode } from '@/api/card'
import { queryApplyProductList } from '@/api/home'
import Native from '@/common/native'
export default {
    name: 'PayStep',
    directives: {
      TransferDom
    },
    components: {
       Popup,
      Group,
      Cell,
      CellBox,
      XButton,
      XInput,
      Scroller,
      Spinner
    },
    data () {
      return {
        money: '',
        showNextStepPopup: false,
        showSelectCardPopup: false, // 选择银行卡popup
        showSelectProductPopup: false, // 选择产品
        showSendMessagePopup: false, // 发送短信验证码
        bindCardList: [],
        bindProductList: [],
        defaultCard: {},
        defaultProduct: {},
        sendCodeContent: '', // 短信验证码,
        pageNum: 1, // 分页，默认是第一页
        pageSize: 10,
        getMoreFlag: true,
        productNameKeyWord: '',
        lastIndexPhoneNum: '',
        counterNum: 59,
        pullUpConfig: {
          content: '上拉可加载更多',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '释放后加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        formatMoney: '',
        focusState: false
      }
    },
    computed: {
      nextBtnFlag () {
        if (!REGULAR.money.test(this.money)) {
          return true
        } else {
          return false
        }
      },
      sendMessageCodeFlag () {
        if (this.defaultCard.bankCode && this.defaultProduct.productName) {
          return false
        } else {
          return true
        }
      },
      hadPopup () {
        if (this.showNextStepPopup || this.showSelectCardPopup || this.showSelectProductPopup || this.showSendMessagePopup) {
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      // 修复ios的bug
      fixedIOS: function () {
        window.scrollTo(0, 0)
      },
      // 重写绑卡名称
      reSetBankName (card) {
        if (card && card.bankName && card.cardNo) {
          let lastNum = card.cardNo.substring(card.cardNo.length - 4, card.cardNo.length)
          return card.bankName + '(' + lastNum + ')'
        } else {
          return ''
        }
      },
      // 绑定银行卡
      getBindCards: function () {
        let _self = this
        bindedCards().then(function (data) {
          if (data && parseInt(data.ret) === 0) {
            _self.bindCardList = data.data.userCardList
            for (let i = 0; i < _self.bindCardList.length; i++) {
              let defaultCard = _self.bindCardList[i]
              if (parseInt(defaultCard.defaultStatus) === 1) {
                _self.defaultCard = defaultCard
              }
            }
          } else {
            _self.$vux.toast.show({
              type: 'text',
              text: data.message
            })
          }
        })
      },
      // 获取申请过的产品列表
      getProductList: function (productName) {
        let _self = this
        let postData = {
          productName: productName,
          pageNum: _self.pageNum,
          pageSize: _self.pageSize
        }
        queryApplyProductList(postData).then(function (data) {
          if (data && parseInt(data.ret) === 0) {
            if (data.data && data.data.length < _self.pageSize) {
              // 没有数据就禁用上拉加载更多
              _self.getMoreFlag = false
              _self.$nextTick(() => {
                _self.$refs.scroller.disablePullup()
                _self.$refs.scroller.donePullup()
                _self.$refs.scroller.reset()
              })
            }
            _self.pageNum = _self.pageNum + 1
            _self.bindProductList = _self.bindProductList.concat(data.data)
            _self.$refs.scroller.donePullup()
          } else {
            _self.$vux.toast.show({
              type: 'text',
              text: data.message
            })
          }
        })
      },
      // 发送支付短信
      sendMsg: function (keepFlag) {
        let _self = this
        let postData = {
          cardNo: _self.defaultCard.cardNo,
          tradeAmount: _self.money,
          productCode: _self.defaultProduct.productNo
        }
        sendMsg(postData).then(function (data) {
          if (data && parseInt(data.ret) === 0) {
            _self.$vux.toast.show({
              type: 'text',
              text: '验证码发送成功'
            })
            _self.getPayMessage(keepFlag)
          } else {
            _self.$vux.toast.show({
              type: 'text',
              text: data.message
            })
          }
        })
      },
      // 确认支付（带验证码）
      beginRepaymentWithCode: function () {
        let _self = this
        let postData = {
          cardNo: _self.defaultCard.cardNo,
          telephone: _self.defaultCard.telePhone,
          tradeAmount: _self.money,
          productCode: _self.defaultProduct.productNo,
          verificationCode: _self.sendCodeContent,
          cardId: _self.defaultCard.cardId
        }
        console.log(postData)
        _self.$vux.loading.show()
        repaymentWithCode(postData).then(function (data) {
          _self.$vux.loading.hide()
          if (data && parseInt(data.ret) === 0) {
            _self.paying(data.data.status)
          } else {
            _self.$vux.toast.show({
              type: 'text',
              text: data.message
            })
          }
        })
      },
      // 产品搜索
      searchProduct: function () {
        this.getMoreFlag = true
        this.bindProductList = []
        this.pageNum = 1
        this.getProductList(this.productNameKeyWord)
      },
      // 下拉加载更多
      loadMore: function () {
        if (this.getMoreFlag) {
          this.getProductList()
        }
      },
      // 重新选择银行卡并返回默认弹窗
      hadSelectedCard: function (card) {
        if (card) {
          this.defaultCard = card
        }
        this.showNextStepPopup = true
        this.showSelectCardPopup = false
      },
      // 选择银行卡
      goSelectCard: function () {
        this.showNextStepPopup = false
        this.showSelectCardPopup = true
      },
      // 选择产品
      goSelectProduct: function () {
        this.showNextStepPopup = false
        this.showSelectProductPopup = true
        this.$refs.scroller.reset({top: 0})
      },
      // 重新选择产品并返回默认弹窗
      hadSelectedProduct: function (product) {
        if (product) {
          this.defaultProduct = product
        }
        this.showNextStepPopup = true
        this.showSelectProductPopup = false
      },
      // 跳转到银行卡列表页面
      goSelectBankCardPage: function () {
        Native.NRouter.open({url:'common-addcard-step.html'})
      },
      changeValue: function () {
        if (this.money && this.money.length > 10) {
          this.money = this.money.substring(0, 10)
          return false
        }
        if (!REGULAR.money.test(this.money)) {
          this.$vux.toast.show({
            type: 'text',
            text: '输入金额格式错误'
          })
          return false
        }
      },
      showSelectItems: function () {
        this.formatMoney = numberComma(this.money)
        this.showNextStepPopup = true
      },
      hideNextStep: function () {
        this.showNextStepPopup = false
      },
      // 开始计数
      beginCounter: function () {
        let _self = this
        _self.counterNum = 59
        let count = setInterval(function () {
          _self.counterNum = _self.counterNum - 1
          if (_self.counterNum === 0) {
            clearInterval(count)
          }
        }, 1000)
      },
      getPayMessage: function (keepFlag) {
        if (!keepFlag) {
          this.showNextStepPopup = false
          this.showSendMessagePopup = true
          if (this.defaultCard) {
            this.lastIndexPhoneNum = this.defaultCard.telePhone.substring(this.defaultCard.telePhone.length - 4, this.defaultCard.telePhone.length)
          }
        }
        this.beginCounter()
      },
      // 重新发送验证码
      reSendCode: function () {
        this.sendMsg(true)
      },
      // 关闭发送短信消息弹窗
      hadSendMessage: function () {
        this.showNextStepPopup = true
        this.showSendMessagePopup = false
      },
      // 付款中
      paying: function (status) {
        Native.NRouter.open({ url:'common-result.html',data: {title:'支付结果', type: 'paymeny',status: status}})
      }
    },
    mounted () {
      this.getBindCards()
      this.getProductList()
      Native.NUI.setHeader({
        title: '支付',
        isBack: true
      })
    }
}
</script>
<style lang="less" scoped>
  .child-view {
    background-color: #f9f9f9;
  }
  .my-box-wrap {
    background-color: #fff;
    margin-top: 40px;
    padding: 20px;
    color: #222222;
    .pay-title {
      font-size: 30px;
    }
    .write-num-box {
      position: relative;
      margin-left: 50px;
      margin-top: 40px;
      margin-bottom: 40px;
      .money-icon {
        position: absolute;
        left: -48px;
        font-size: 50px;
      }
      .num {
        height: 80px;
        width: 100%;
        font-size: 40px;
        outline: none;
        border: none;
        border-bottom: solid 2px #dcdcdc;
      }
    }
  }
  .next-btn-wrap {
    margin-top: 40px;
  }
  .next-btn {
    width: 264px;
    height: 100px;
    font-size: 36px;

  }
  .popup-content-box {
    height: 560px;
    padding: 20px;
    background-color: #fff;
    .cell-wrap {
      padding-top: 30px;
      padding-bottom: 30px; 
      padding-left: 0px;
      padding-right: 0px;
    }
    .cell-wrap:before {
      left: 0 !important;
    }
    .left-title {
      font-size: 30px;
      color: #7d7d7d;
    }
    .right-value {
      padding-right: 20px;
      font-size: 30px;
      color: #222222;
      font-weight: bolder;
    }
    .next-btn-box {
      margin-top: 30px;
    }
    .header-box {
      position: relative;
      padding-bottom: 20px;
      text-align: center;
      font-size:30px;
      font-weight:400;
      .close-icon {
        position: absolute;
        display: inline-block;
        height: 30px;
        width: 30px;
        left: 0px;
        top: 10px;
      }
    }
    .pay-num {
      width: 100%;
      font-size:50px;
      font-weight: bolder;
      text-align: center;
    }
    .send-phone {
      font-size:26px;
      color: #4A4A4A;
      padding-bottom: 30px;
    }
    .send-message-wrap {
      position: relative;
      padding-right: 120px;
      margin-bottom: 40px;
      border: solid 1px #dcdcdc;
      border-radius: 12px;
      padding-left: 20px;
      .send-code-input {
        width: 100%;
        border: none;
        height: 66px;
        line-height: 66px;
        outline: none;
      }
      .counter-wrap {
        position: absolute;
        width: 120px;
        right: 0;
        top: 0;
        display: inline-block;
        height: 66px;
        line-height: 66px;
        border-left: solid 1px #dcdcdc;
        text-align: center;
        color: @default;
      }
    }
  }
  .product-input-wrap {
    position: relative;
    margin-bottom: 20px;
    .search-icon {
        position: absolute;
        top: 12px;
        right: 14px;
        width: 32px;
        height: 33px;
      }
      .product-input {
        height: 56px;
        width: 100%;
        font-size: 30px;
        outline: none;
        border: none;
        border: solid 1px #BAB9B9;
        border-radius: 6px;
      }
  }
  .select-icon {
    height: 25px;
    width: 35px;
  }
  .left-title {
    color: #4a4a4a !important;
  }
  .none-more {
    font-size: 24px;
    text-align: center;
    margin-top: 20px;
    color: #dcdcdc;
  }
</style>

