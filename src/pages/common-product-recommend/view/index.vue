<!-- 首页产品推荐 -->
<template>
  <section class="product-wrapper">
    <div class="title">
      <h2>为你推荐</h2>
      <div class="change">
        <a href="javascript:;" @click="changeProductList">
          <span>换一批</span>
          <img :src="iconChange" alt="">
        </a>
      </div>
    </div>
    <ul class="product-list">
      <li class="product-item"  v-for="(item) in productList" :key="item.productNo" @click="goPageDetail(item.productNo)">
        <ProductItem :itemData="item"></ProductItem>
      </li>
    </ul>
  </section>
</template>

<script>
/*eslint-disable */
  import ProductItem from '@/components/ProductItem.vue'
  import {getProductList} from '@/api/product'
  import iconChange from '@/assets/icon/icon-change@2x.png' // 换一换图标
  import Native from '@/common/native.js'
  export default {
    name: 'CommonProductRecommend', // 首页推荐产品
    components: {
      ProductItem
    },
    data () {
      return {
        iconChange,
        /* 用户信息 */
        userInfo: JSON.parse(localStorage.getItem('getUserInfo')),
        productList: null, // 产品列表数据
      }
    },
    created () {
      this.getProductListData()
    },
    methods: {
      /* 获取产品列表 */
      async getProductListData () {
        let params = {
          isRecommend: 1
        }
        let data = await getProductList(params)
        if (data && data.ret === '0') {
          this.productList = data.data
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: data.message
          })
        }
      },
      /* 点击换一换 */
      changeProductList() {
        this.getProductListData()
      },
      /* 跳转到详情页 */
      goPageDetail(productNo){
        let url = this.userInfo.userType === '0'?'sale-product-detail.html': 'loan-product-detail.html'
        console.log("url："+url)
        Native.NRouter.open({
          url: url,
          data: {
            productNo: productNo
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .product-wrapper {
    /*margin-top: 30px;*/
  }
  .title {
    position: relative;
    h2 {
      position: relative;
      margin-left: 20px;
      padding-left: 11px;
      height:34px;
      line-height:34px;
      font-size:24px;
      font-weight:400;
      color:#7D7D7D;
    }
    h2:before {
      position: absolute;
      top: 4px;
      left: 0;
      content: ' ';
      width: 6px;
      height: 26px;
      background-color: #C81722;
    }
  }
  .product-list {
    margin-top: 30px;
    padding: 0 20px;
    .product-item {
      margin-top: 10px;
    }
  }
  .change {
    position: absolute;
    right: 20px;
    top: 0;
    line-height: 34px;
    text-align: right;
    span {
      height:34px;
      margin-right: 5px;
      font-size:24px;
      font-weight:400;
      color:#4A90E2;
    }
    img {
      width: 27px;
      vertical-align: top;
    }
  }

</style>
