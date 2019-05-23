<template>
  <div class="my-box-wrap">
      <group>
        <cell style="padding-top: 10px;padding-bottom: 10px"  @click.native="goPayPage()">
          <img slot="icon" width="20" style="display:block;margin-right:10px;" src="@/assets/icon/pay-type-icon.png">
          <span slot="title" style="font-size: 13px;">支付</span>
        </cell>
        <cell style="padding-top: 10px;padding-bottom: 10px"   @click.native="goPayFormPage()">
          <img slot="icon" width="20" style="display:block;margin-right:10px;" src="@/assets/icon/pay-form-icon.png">
          <span slot="title" style="font-size: 13px;">支付订单</span>
        </cell>
        <div class="bottom-line"></div>
      </group>
    </div>
</template>
<script>
/*eslint-disable */
import { Group, Cell } from 'vux'
import Native from '@/common/native'
export default {
    name: 'PayTypeList',
    components: {
      Group,
      Cell
    },
    data () {
      return {
      }
    },
    methods: {
      goPayPage: function() {
        Native.NRouter.open({url:'loan-payment-step.html'})
      },
      goPayFormPage: function() {
        Native.NRouter.open({url:'loan-payment-form.html'})
      },
    },
    mounted () {
      // 接收传递过来的类型，状态，返回的url
      this.type = this.$route.query.type
      this.status = this.$route.query.status
      Native.NUI.setHeader({
        title: '贷超',
        isBack: true
      })
    }
}
</script>
<style lang="less" scoped>
  .my-box-wrap {
    padding: 20px;
    .bottom-line {
      position: absolute;
      border-top: 1px solid #D9D9D9;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      left: 15px;
      right: 0px;
      z-index: 10;
      bottom: 0px;
    }
    .my {
      height: 226px;
      background-color: @default;
      border-radius: 6px;
      .my-detail-box {
        position: relative;
        padding-left: 240px;
        padding-top: 72px;
        color: #ffffff;
        .my-detail {
          position: absolute;
          left: 20px;
          .my-icon {
            display: inline-block;
            width: 90px;
            height: 90px;
            margin-right: 10px;
          }
          .my-state {
            display: inline-block;
            font-size: 30px;
            position: relative;
            top: -18px;
            .state {
              padding: 0px 4px;
              font-size: 12px;
              font-weight: normal;
              border: solid 1px #ffffff;
              border-radius: 12px;
            }
          }
        }
        .form-name {
          font-size: 20px;
          text-align: center;
          margin-bottom: 6px;
        }
        .form-num {
          font-size: 30px;
          font-weight: bolder;
          text-align: center;
        }
      }
    }
    .my-item-box {
      margin-top: 20px;
      .my-item {
        position: relative;
        height: 110px;
        margin-left: 110px;
        border-bottom: solid 1px #dcdcdc;
        font-size:30px;
        font-weight: bolder;
        line-height: 110px;
        .item-icon {
          position: absolute;
          left: -77px;
          top: 32px;
          height: 46px;
          width: 46px;
        }
        .item-arrow-right {
          position: absolute;
          top: 4px;
          right: 30px;
          i {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-top: 2px solid #dcdcdc;
            border-right: 2px solid #dcdcdc;
            transform:rotate(45deg);
          }
        }
      }
    }
  }
</style>

