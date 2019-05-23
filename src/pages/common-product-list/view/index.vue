<!-- 产品列表页 -->
<template>
  <section class="product-wrapper">
    <Scroller height="100%" :lockX=true  :pulldown-config="pullDownConfig" :pullup-config="pullUpConfig"  ref="myScroller" :use-pulldown=true :use-pullup=true @on-pullup-loading="loadMore" @on-pulldown-loading="refresh">
      <ul class="product-list">
        <li class="product-item" v-for="(item) in productList" :key="item.productNo" @click="goPageDetail(item.productNo)">
            <ProductItem :itemData="item"></ProductItem>
        </li>
      </ul>
    </Scroller>
  </section>
</template>

<script>
/* eslint-disable */
  import ProductItem from '@/components/ProductItem.vue'
  import { Scroller, Spinner } from 'vux'
  import {getProductList} from '@/api/product'
  import Native from '@/common/native.js'
  export default {
    name: 'ProductList',
    components: {
      Scroller,
      ProductItem
    },
    data () {
      return {
        test: '',
        test1: '',
        /* 用户信息 */
        userInfo: JSON.parse(localStorage.getItem('getUserInfo')),
        productList: [], // 产品列表数据
        /* 分页器对象 */
        pagination: {
          current: 1, // 当前页数
          pageSize: 10 // 总页数
        },
        getMoreFlag: false,
        pullDownConfig: {
          content: '下拉刷新',
          height: 40,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '释放后刷新',
          loadingContent: '正在刷新...',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        pullUpConfig: {
          content: '上拉可加载更多',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '释放后加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        }
      }
    },
    created () {
      /* 获取产品列表 */
      console.log(this.userInfo)
      this.getProductListData()
      /* 设置头部 */
      Native.NUI.setHeader({
        title: '产品列表页',
        isBack: true
      })
    },
    methods: {
      /* 获取产品列表 */
      async getProductListData (type) {
        let params = {
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          isRecommend: '0'
        }
        Native.NUI.loading({
          text: ''
        })
        let data = await getProductList(params)
        Native.NUI.loadFinish()
        if (data && data.ret === '0') {
          /* 如果下拉刷新 */
          if (type === 'refresh') {
            this.productList = []
            this.$refs.myScroller.disablePullup()
            this.$nextTick(() => {
              this.$refs.myScroller.donePulldown()
              this.$refs.myScroller.reset({top: 0})
              this.$refs.myScroller.enablePullup()
            })
          }
          /* 如果加载数据小于每页数据 */
          if(data.data.length < this.pagination.pageSize) {
            this.getMoreFlag = false
            this.$nextTick(() => {
              this.$refs.myScroller.disablePullup()
              this.$refs.myScroller.donePullup()
              this.$refs.myScroller.reset()
            })
          }
          this.productList = this.productList.concat(data.data)
          this.$refs.myScroller.donePullup()
        } else {
          Native.NUI.tip({
            text: data.message
          })
        }
      },
      loadMore: function () {
        if (this.getMoreFlag) {
          this.pagination.current += 1
          this.getProductList()
        }
      },
      // 下拉刷新
      refresh: function () {
        this.pagination.current = 1
        this.getMoreFlag = true
        this.getProductListData('refresh')
      },
      /* 跳转到详情页 */
      goPageDetail(productNo){
        let url = this.userInfo.userType === '0'?'sale-product-detail.html': 'loan-product-detail.html'
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
  @import '~@/styles/variables.less';
  .product-wrapper {
    min-height: 100%;
  }
  .product-list {
    padding: 20px;
    .product-item {
      margin-bottom: 10px;
    }
  }
</style>
