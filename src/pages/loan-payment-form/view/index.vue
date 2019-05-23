<template>
  <div class="loan-box-wrap">
      <div class="loan-box bg-dcdcdc "  v-show="!paymentRecord.length">
        <div class="box-title">
          <span>{{calendarValue}}</span>
          <img  class="box-title-icon" src="@/assets/icon/date-icon.png" alt="" />
          <div class="calender-wrap">
            <group class="calender-box">
              <calendar title="请选择日期" class="calender-context" v-model="calendarValue" @on-change="selectedCalender()">
              </calendar>
            </group>
          </div>
        </div>
      </div>
      <div class="loan-box" v-for="(record, recordIndex) in paymentRecord" :key="record.paymentDay" v-show="paymentRecord.length>0">
        <div class="box-title">
          <span>{{record.paymentDay}}</span>
          <img  class="box-title-icon" src="@/assets/icon/date-icon.png" alt="" v-show="recordIndex===0" />
          <div class="calender-wrap" v-show="recordIndex===0">
            <group class="calender-box">
              <calendar title="请选择日期" class="calender-context" v-model="calendarValue" @on-change="selectedCalender()">
              </calendar>
            </group>
          </div>
        </div>
        <div class="loan-context" v-for="(form, $index) in record.paymentRecordDataList" :key="$index">
          <flexbox>
            <flexbox-item :span="8">
              <div class="clear-fixed">
                <div class="inline-block loan-name-box">
                  <p class="loan-icon-wrap"><img class="loan-icon" :src="form.productLogo"  alt="" /></p>
                  <p class="loan-name">{{form.productName}}</p>
                </div>
                <div class="inline-block loan-detail-box">
                  <p class="phone">{{form.paymentUserName | cryptoName }} {{form.paymentPhone | cryptoPhone}} [{{form.paymentType}}]</p>
                  <p class="apply-time">申请时间:{{form.tradeCreateTime}}</p>
                </div>
              </div>
            </flexbox-item>
            <flexbox-item>
              <div class="state-box" v-if="form.status=== '00'">
                <p>-{{form.tradeAmount}}</p>
                <p>支付处理中</p>
                </div>
              <div class="state-box" v-if="form.status=== '10'">
                <p>-{{form.tradeAmount}}</p>
                <p class="success">支付成功</p>
              </div>
              <div class="state-box " v-if="form.status=== '01'">
                <p>-{{form.tradeAmount}}</p>
                <p class="failure">支付失败</p>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <div class="none-data" v-show="!paymentRecord.length">暂无数据</div>
    </div>
</template>
<script>
/*eslint-disable */
import { Flexbox, FlexboxItem, Calendar, Group, dateFormat } from 'vux'
import { paymentRecord } from '@/api/card'
import Native from '@/common/native'
export default {
    name: 'payForms',
    components: {
      Flexbox,
      FlexboxItem,
      Calendar,
      Group
    },
    data () {
      return {
        paymentTime: null,
        paymentRecord: [],
        calendarValue: dateFormat(new Date(), 'YYYY-MM-DD')
      }
    },
    filters: {
      cryptoName: function (value) {
        if (value) {
          let sub = value.substring(0, 1)
          return sub + '*'
        }
      },
      cryptoPhone: function (value) {
        if (value) {
          let pre = value.substring(0, 3)
          let last = value.substring(value.length - 4, value.length)
          return pre + '****' + last
        }
      }
    },
     methods: {
      getPaymentRecord: function () {
        let _self = this
        let postData = {
          paymentTime: _self.paymentTime
        }
        paymentRecord(postData).then(function (data) {
          if (data && parseInt(data.ret) === 0) {
            _self.paymentRecord = data.data.paymentRecord
          } else {
            _self.$vux.toast.show({
              type: 'text',
              text: data.message
            })
          }
        })
      },
      selectedCalender: function () {
        let _self = this
        _self.paymentTime = _self.calendarValue
        this.getPaymentRecord()
      }
    },
    mounted () {
       this.getPaymentRecord()
       Native.NUI.setHeader({
          title: '支付订单',
          isBack: true
       })
    }
}
</script>
<style lang="less" scoped>
 .child-view {
    background-color: #f9f9f9;
  }
  .none-data {
    text-align: center;
    font-size: 30px;
    line-height: 60px;
  }
  .inline-block {
    display: inline-block
  }
  .clear-fixed {
    clear: both;
  }
  .loan-box-wrap {
    .bg-dcdcdc { background-color: #dcdcdc; }
    .loan-box {
      .box-title {
        position: relative;
        height: 60px;
        padding: 10px 20px 10px 20px;
        font-size: 30px;
        line-height: 60px;
        font-weight: bolder;
        color: #4a4a4a;
        .box-title-icon {
          position: absolute;
          right: 10px;
          top: 20px;
          width: 42px;
          height: 35px;
          z-index: 10;
        }
        .calender-wrap {
          position: absolute;
          height: 60px;
          left: 0;
          right: 0;
          top: 0;
          opacity: 0;
          z-index: 20;
          .calender-box {
            height: 60px;
            top: -20px;
            position: relative;
            .calender-context {
              height: 60px;
            }
          }
        }
      }
      .loan-context {
        height:130px;
        padding-top: 50px;
        padding-left: 16px;
        padding-right: 16px;
        border-bottom: solid 1px #f9f9f9;
        background-color: #fff;
        border-radius: 6px;
        .loan-name-box {
          text-align: center;
          margin-right: 20px;
          width: 80px;
          float: left;
          .loan-icon-wrap {
            line-height: 24px;
          }
          .loan-icon {
            height: 36px;
            width: 36px;
          }
          .loan-name {
            font-size:24px;
            color: #7d7d7d;
            font-weight: bolder;
            text-overflow: ellipsis;
            width: 92px;
            white-space: nowrap;
            overflow: hidden;
          }
        }
        .loan-detail-box {
          float: left;
          .phone {
            color: #4a4a4a;
            font-size:24px;
          }
          .apply-time {
            color: #7d7d7d;
            font-size:24px;
          }
        }
        .state-box {
          color: #4a4a4a;
          font-weight: bolder;
          font-size:24px;
          text-align: right;
          .failure {
            color: @default;
          }
          .success {
            color: #529805;
          }
        }
        
      }
    }
  }
</style>

