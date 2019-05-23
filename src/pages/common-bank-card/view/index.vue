<template>
    <div class="bankcard-box-wrap">
      <div class="add-card-box" @click="goAddBankCard()">
        <span class="add-icon">+</span>添加银行卡
      </div>
      <div v-if="showImgeBox">
          <div style="height: 100px">
            <h5>加载本地图片@/assets/icon/date-icon.png</h5>
                <img  class="box-title-icon" src="@/assets/icon/date-icon.png" alt="" />
        </div>
        <div style="height: 100px">
            <h5>加载外部链接图片https://hxyl-dc-apk.oss-cn-shenzhen.aliyuncs.com/dcAdmin/dcAdmin_productLogo/20190425/20190425145301_kg3obiaa54.jpg</h5>
                <img  class="box-title-icon" style="height: 80px" src="https://hxyl-dc-apk.oss-cn-shenzhen.aliyuncs.com/dcAdmin/dcAdmin_productLogo/20190425/20190425145301_kg3obiaa54.jpg" alt="" />
        </div>
        <div style="height: 100px">
            <h5>加载base64图片</h5>
                <img  class="box-title-icon" style="height: 80px" src="data:image/png;base64,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" alt="" />
        </div>
      </div>
        


      <div class="card-list-box">
        <div class="card-box linear-box-red" :class="backgroundBox(card.bankCode)" v-for="card in userCardList" :key="card.cardNo">
          <div class="card-header-box">
            <img class="card-icon" :src="card.logo" alt=""/>
            <div class="card-name">
              <p>{{card.bankName}}</p>
              <p class="card-type">{{card.cardName}}</p>
            </div>
          </div>
          <div class="card-num-box">{{card.cardNo}}</div>
        </div>
      </div>
    </div>
</template>
<script>
/*eslint-disable */
import { Group, Cell, CellBox } from 'vux';
import Native from '@/common/native'
import { bindedCards } from '@/api/card'
export default {
    name: 'BankCards',
    components:{
        Group,
        Cell,
        CellBox
    },
    data () {
        return {
            showImgeBox: false,
            userCardList: []
        }
    },
    methods: {
        backgroundBox: function (bankCode) {
        let defaultBg = { 'linear-box-red': true }
        if (bankCode === 'BOC' || bankCode === 'ICBC' || bankCode === 'GDB' || bankCode === 'CNCB') {
            defaultBg = { 'linear-box-red': true }
        } else if (bankCode === 'PAB') {
            defaultBg = { 'linear-box-yellow': true }
        } else if (bankCode === 'PSBC') {
            defaultBg = { 'linear-box-green': true }
        } else if (bankCode === 'CCB' || bankCode === 'CIB' || bankCode === 'SPDB' || bankCode === 'SHB') {
            defaultBg = { 'linear-box-blue': true }
        }
        return defaultBg
        },
        goAddBankCard: function () {
            console.log('添加银行卡:'+localStorage.getItem('storeAddBankCardFirstStepInfo'))
            localStorage.setItem('storeAddBankCardFirstStepInfo', '')
            Native.NRouter.open({url:'common-addcard-step.html'})
        },
        getBindedCards: function () {
            let _self = this
            bindedCards().then(function (data) {
                if (data && parseInt(data.ret) === 0) {
                _self.userCardList = data.data.userCardList
                } else {
                _self.$vux.toast.show({
                    type: 'text',
                    text: data.message
                })
                }
            })
        }
    },
    mounted(){
        let _self = this
        setTimeout(function () {
            _self.showImgeBox = true
        },3000)
        this.getBindedCards()
        Native.NUI.setHeader({
            title: '银行卡列表',
            isBack: true
        })
        console.log("base64图片地址：\n"+ "data:image/png;base64,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")
    }
}
</script>
<style lang='less' scoped>
.bankcard-box-wrap {
    padding: 20px;
    .add-card-box {
        height: 100px;
        line-height: 100px;
        border: #979797 1px dashed;
        color: #4a4a4a;
        font-weight: bolder;
        text-align: center;
        font-size: 30px;
    }
    .card-list-box {
        padding-top: 40px;
        .card-box {
        position: relative;
        height: 238px;
        margin-bottom: 20px;
        border-radius: 6px;
        color: #fff;
        font-size: 26px;
        .card-header-box {
            position: absolute;
            top: 20px;
            left: 20px;
            height: 88px;
            .card-icon {
            display: inline-block;
            height: 64px;
            width: 64px;
            background: #fff;
            border-radius: 50%;
            }
            .card-name {
            display: inline-block;
            .card-type {
                font-size: 12px;
                color: #f9f9f9;
            }
            }
        }
        .card-num-box {
            position: absolute;
            bottom: 20px;
            left: 20px;
        }
        }
        .linear-box-red {
        background: linear-gradient(to right,#A50000, #F07279)
        }
        .linear-box-yellow {
            background: linear-gradient(to right,#a9c135, #bfd040)
        }
        .linear-box-green {
            background: linear-gradient(to right,#63b139, #5fba37)
        }
        .linear-box-blue {
            background: linear-gradient(to right,#215da1, #327bd0)
        }
    }
}

</style>
