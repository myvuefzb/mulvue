<!-- 产品列表项公共组件 -->
<template>
  <div class="product">
    <header class="header clear">
      <div class="product-name">
        <img :src="itemData.logoUrl" alt=""><h2>{{itemData.productName}}</h2>
      </div>
      <ul class="product-cate">
        <li class="" v-for="(item,index) in itemData.charactList" :key="index">{{item}}</li>
      </ul>
    </header>
    <ul class="product-info clear">
      <li class="product-info-item">
        <label>最高额度</label>
        <span>{{itemData.maxLoanAmt}}万</span>
      </li>
      <li class="product-info-item">
        <label>年化利率</label>
        <span>{{itemData.yearRate}}</span>
      </li>
      <li class="product-info-item">
        <label>还款期限</label>
        <span>{{itemData.repayTerm}}</span>
      </li>
    </ul>
    <div class="arrow-right">
      <i></i>
    </div>
  </div>
</template>

<script>
/* eslint-disable */ 
  export default {
    name: 'ProductItem',
    props: {
      /* 单个产品数据 */
      itemData: {
        type: Object,
        required: false
      }
    },
    data () {
      return {
      }
    },
    methods: {}
  }
</script>

<style scoped lang="less">
  .product {
    position: relative;
    height:180px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #F9F9F9;
    border-radius:6px;
  }
  .product-name {
    float: left;
    height: 40px;
    img {
      width: 40px;
      max-height: 40px;
    }
    h2 {
      display: inline-block;
      margin-left: 20px;
      height:40px;
      line-height:40px;
      vertical-align: top;
      font-size:24px;
      font-weight:600;
      color:#7D7D7D;
      width: 135px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .product-cate {
    float: left;
    padding-top: 8px;
    margin-left: 60px;
    li {
      float: left;
      margin-left: 40px;
      padding: 0 14px;
      height:28px;
      line-height:28px;
      font-size:18px;
      font-weight:400;
      color:#A50000;
      border-radius:6px;
      border:1px solid #A50000;
    }
  }
  .product-info {
    margin-top: 30px;
  }
  .product-info-item {
    float: left;
    margin-right: 60px;
    label {
      display: block;
      height:25px;
      font-size:18px;
      font-weight:400;
      color:#9A9A9A;
      line-height:25px;
    }
    span {
      display: block;
      margin-top: 4px;
      height:30px;
      line-height:30px;
      font-size:22px;
      font-weight:600;
      color:#7D7D7D;

    }
  }
  .arrow-right {
    position: absolute;
    top: 77px;
    right: 30px;
     i {
      display: inline-block;
      width: 27px;
      height: 27px;
      border-top: 4px solid #BAB9B9;
      border-right: 4px solid #BAB9B9;
      transform:rotate(45deg);
    }
  }
</style>
