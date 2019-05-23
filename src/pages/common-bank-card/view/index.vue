<template>
    <div class="bankcard-box-wrap">
      <div class="add-card-box" @click="goAddBankCard()">
        <span class="add-icon">+</span>添加银行卡
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
        this.getBindedCards()
        Native.NUI.setHeader({
            title: '银行卡列表',
            isBack: true
        })
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
