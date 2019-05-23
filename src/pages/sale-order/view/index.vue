<!-- 订单列表页 -->
<template>
  <section class="order">
    <header class="head-search">
      <flexbox class="search-list" :gutter="0">
        <flexbox-item v-for="(item, key) in dataObj" :key="key" v-show="item.show">
          <div class="search-item" @click="selectHandle(key)">
            <strong v-if="key=== 'storeObj' || key=== 'salesmanObj'">{{key === 'storeObj'? item.current.storeName:item.current.realName}}</strong>
            <strong v-else>{{item.current.name}}</strong>
            <span>
            <i class="arrow-bottom"></i>
          </span>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="search-item">
            <strong>筛选</strong>
          </div>
        </flexbox-item>
      </flexbox>
    </header>
    <!--<ul class="wrap-list">
      <li class="wrap-item">
        <header class="date">
          <h3>2019-03-05</h3>
          <div class="select-date">
            <img :src="iconCalendar" alt="">
          </div>
        </header>
        <ul class="list">
          <li class="item clear">
            <div class="left">
              <img :src="productPic" alt="">
              <h4>快快贷</h4>
            </div>
            <div class="right">
              <div class="order-info">
                <h5>杜* 134****7878<span>[申请订单]</span></h5>
                <p class="time">申请时间:2019-03-05 14:35:23</p>
              </div>
              <div class="order-state">申请处理中</div>
            </div>
          </li>
          <li class="item clear">
            <div class="left">
              <img :src="productPic" alt="">
              <h4>快快贷</h4>
            </div>
            <div class="right">
              <div class="order-info">
                <h5>杜* 134****7878<span>[申请订单]</span></h5>
                <p class="time">申请时间:2019-03-05 14:35:23</p>
              </div>
              <div class="order-state">申请处理中</div>
            </div>
          </li>
          <li class="item clear">
            <div class="left">
              <img :src="productPic" alt="">
              <h4>快快贷</h4>
            </div>
            <div class="right">
              <div class="order-info">
                <h5>杜* 134****7878<span>[申请订单]</span></h5>
                <p class="time">申请时间:2019-03-05 14:35:23</p>
              </div>
              <div class="order-state">申请处理中</div>
            </div>
          </li>
        </ul>
      </li>
      <li class="wrap-item">
        <header class="date">
          <h3>2019-03-06</h3>
        </header>
        <ul class="list">
          <li class="item clear">
            <div class="left">
              <img :src="productPic" alt="">
              <h4>快快贷</h4>
            </div>
            <div class="right">
              <div class="order-info">
                <h5>杜* 134****7878<span>[申请订单]</span></h5>
                <p class="time">申请时间:2019-03-05 14:35:23</p>
              </div>
              <div class="order-state">申请处理中</div>
            </div>
          </li>
          <li class="item clear">
            <div class="left">
              <img :src="productPic" alt="">
              <h4>快快贷</h4>
            </div>
            <div class="right">
              <div class="order-info">
                <h5>杜* 134****7878<span>[申请订单]</span></h5>
                <p class="time">申请时间:2019-03-05 14:35:23</p>
              </div>
              <div class="order-state">申请处理中</div>
            </div>
          </li>
          <li class="item clear">
            <div class="left">
              <img :src="productPic" alt="">
              <h4>快快贷</h4>
            </div>
            <div class="right">
              <div class="order-info">
                <h5>杜* 134****7878<span>[申请订单]</span></h5>
                <p class="time">申请时间:2019-03-05 14:35:23</p>
              </div>
              <div class="order-state">申请处理中</div>
            </div>
          </li>
        </ul>
      </li>
    </ul>-->
    <div class="content">
      <div class="no-record">暂无数据</div>
    </div>
    <div class="select-dialog" v-show="dialogShow">
      <div class="select-bg" @click="dialogHide"></div>
      <div class="select-area" v-show="dataObj.orderType.dialogShow">
        <ul class="select-list">
          <li class="select-item" :class="{'cur':dataObj.orderType.current.id === item.id}" @click="orderTypeSelect(item)" v-for="(item) in dataObj.orderType.list" :key="item.id">{{item.name}}</li>
        </ul>
      </div>
      <div class="select-area" v-if="this.dataObj.storeObj.show" v-show="dataObj.storeObj.dialogShow">
        <ul class="select-list">
          <li class="select-item" :class="{'cur': dataObj.storeObj.current.storeId === item.storeId}" v-for="(item) in dataObj.storeObj.list" :key="item.storeId" @click="selectStoreData(item)">{{item.storeName}}</li>
        </ul>
      </div>
      <div class="select-area"  v-if="this.dataObj.salesmanObj.show" v-show="dataObj.salesmanObj.dialogShow">
        <ul class="select-list">
          <li class="select-item" :class="{'cur': dataObj.salesmanObj.current.saleId === item.saleId}" v-for="(item) in dataObj.salesmanObj.list" :key="item.saleId" @click="selectSalesData(item)">{{item.realName}}</li>
        </ul>
      </div>
      <div class="select-area" v-show="dataObj.orderState.dialogShow">
        <ul class="select-list">
          <li class="select-item" :class="{'cur':dataObj.orderState.current.id === item.id}" @click="orderStateSelect(item)" v-for="(item) in dataObj.orderState.list" :key="item.id">{{item.name}}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
/*eslint-disable */
  import { Flexbox, FlexboxItem } from 'vux'
  import {queryStores, querySales} from '@/api/home'
  // import productPic from '@/assets/product-pic.png'
  import iconCalendar from '@/assets/icon/icon-calendar@2x.png'
  import {getUserRole} from '@/utils/index'
  import Native from '@/common/native.js'
  export default {
    name: 'OrderList',
    components: {
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        // productPic,
        iconCalendar,
        /* 选择区域是否显示 */
        dialogShow: false,
        /* 用户信息，角色信息 */
        userInfo: JSON.parse(localStorage.getItem('getUserInfo')),
        userRole: getUserRole(),
        /* 页面数据类型 */
        dataObj: {
          /* 订单类型对象 */
          orderType: {
            show: true,
            dialogShow: false,
            current: {
              id: 'all',
              name: '申请订单'
            },
            list: [
              {
                id: 'all',
                name: '申请订单'
              }
            ]
          },
          /* 门店对象 */
          storeObj: {
            show: false,
            dialogShow: false,
            current: {
              storeId: '',
              storeName: '全部门店'
            },
            list: null
          },
          /* 业务员对象 */
          salesmanObj: {
            show: false,
            dialogShow: false,
            current: {
              saleId: '',
              realName: '全部业务员'
            },
            list: null
          },
          /* 订单状态对象 */
          orderState: {
            show: true,
            dialogShow: false,
            current: {
              id: 'all',
              name: '全部状态'
            },
            list: [
              {
                id: 'all',
                name: '全部状态'
              },
              {
                id: 'success',
                name: '申请成功'
              },
              {
                id: 'processing',
                name: '申请处理中'
              },
              {
                id: 'fail',
                name: '申请失败'
              }
            ]
          }
        }
      }
    },
    created () {
      this.init()
      /* 设置头部 */
      Native.NUI.setHeader({
        title: '订单',
        isBack: true
      })
    },
    methods: {
      init () {
        let role = this.userRole
        // let role = 'storeManager'
        if (role === 'boss') { // 老板
          this.dataObj.salesmanObj.show = false
          this.getStoreList()
        } else if (role === 'storeManager') { // 店长
          this.dataObj.storeObj.show = false
          this.getSalesList()
        } else if (role === 'salesman') { // 业务员
          this.dataObj.storeObj.show = false
          this.dataObj.salesmanObj.show = false
        }
      },
      /* 获取门店列表 */
      async getStoreList () {
        Native.NUI.loading({
          text: '加载中...'
        })
        let data = await queryStores()
        Native.NUI.loadFinish()
        if (data && data.ret === '0') {
          let dataAry = [
            {
              saleId: '',
              realName: '全部门店'
            }
          ]
          this.dataObj.storeObj.list = dataAry.concat(data.data)
        } else {
          this.dataObj.storeObj.list = [{
            storeId: '',
            storeName: '全部门店'
          }]
          Native.NUI.tip({
            text: data.message
          })
        }
      },
      /* 获取业务员列表 */
      async getSalesList () {
        let params = {
          storeId: this.userInfo.storeId
        }
        Native.NUI.loading({
          text: '加载中...'
        })
        let data = await querySales(params)
        Native.NUI.loadFinish()
        if (data && data.ret === '0') {
          let dataAry = [
            {
              saleId: '',
              realName: '全部业务员'
            }
          ]
          this.dataObj.salesmanObj.list = dataAry.concat(data.data)
        } else {
          this.dataObj.salesmanObj.list = [{
            saleId: '',
            realName: '全部业务员'
          }]
          Native.NUI.tip({
            text: data.message
          })
        }
      },
      /* 选择区域隐藏 */
      dialogHide () {
        this.dialogShow = false
        this.dataObj.orderType.dialogShow = false
        this.dataObj.storeObj.dialogShow = false
        this.dataObj.salesmanObj.dialogShow = false
        this.dataObj.orderState.dialogShow = false
      },
      /* 点击选择筛选条件 */
      selectHandle (key) {
        if (key === 'orderType') {
          return false
        }
        this.dialogShow = true
        if (key === 'orderType') {
          this.dataObj.orderType.dialogShow = true
        } else if (key === 'storeObj') {
          this.dataObj.storeObj.dialogShow = true
        } else if (key === 'salesmanObj') {
          this.dataObj.salesmanObj.dialogShow = true
        } else {
          this.dataObj.orderState.dialogShow = true
        }
      },
      /* 订单类型点击事件方法回调 */
      orderTypeSelect (item) {
        if (this.dataObj.orderType.current.id !== item.id) {
          this.dataObj.orderType.current = item
          this.dialogHide()
        }
      },
      /* 店员点击事件方法回调 */
      selectStoreData (item) {
        if (this.dataObj.storeObj.current.storeId !== item.storeId) {
          this.dataObj.storeObj.current = item
          this.dialogHide()
        }
      },
      /* 业务员点击事件方法回调 */
      selectSalesData (item) {
        if (this.dataObj.salesmanObj.current.saleId !== item.saleId) {
          this.dataObj.salesmanObj.current = item
          this.dialogHide()
        }
      },
      /* 订单状态点击事件方法回调 */
      orderStateSelect (item) {
        if (this.dataObj.orderState.current.id !== item.id) {
          this.dataObj.orderState.current = item
          this.dialogHide()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@/styles/variables.less';
  .head-search {
    height: 42px;
  }
  .order {
    min-height: 100%;
    background-color: #f0f2f5;
  }
  .search-item {
    text-align: center;
    strong {
      display: inline-block;
      height:38px;
      line-height:38px;
      font-size:26px;
      font-weight:400;
      color:#4A4A4A;
    }
    span {
      height: 38px;
      display: inline-block;
      margin-left: 8px;
      vertical-align: top;
      i {
        position: relative;
        top: -4px;
        display: inline-block;
        width: 12px;
        height: 12px;
        border-top: 4px solid #888;
        border-right: 4px solid #888;
        transform:rotate(135deg);
      }
    }
  }
  .date {
    position: relative;
    padding-left: 20px;
    height:85px;
    line-height:85px;
    font-size:32px;
    font-weight:500;
    color:#4A4A4A;
  }
  .select-date {
    position: absolute;
    top: 22px;
    right: 20px;
    width: 40px;
    height: 40px;
    img {
      width: 100%;
      vertical-align: top;
    }
  }
  .list {
    background-color: #fff;
    .item {
      position: relative;
      height: 130px;
      padding-top: 50px;
    }
    .left {
      float: left;
      width: 17.333333%;
      text-align: center;
      img {
        width: 44px;
        height: 40px;
      }
      h4 {
        vertical-align: top;
        margin-top: 10px;
        height:34px;
        line-height:34px;
        font-size:24px;
        font-weight:400;
        color:#7D7D7D;
      }
    }
    .right {
      margin: 0 20px 0 17.333333%;
      height: 130px;
      padding-top: 6px;
      border-bottom: 2px solid #eee;
      .order-info {
        margin-right: 140px;
        h5 {
          height:30px;
          line-height:30px;
          font-size:22px;
          font-weight:400;
          color:#4A4A4A;
          span {
            display: inline-block;
            vertical-align: bottom;
            margin-left: 30px;
            height:22px;
            line-height:22px;
            font-size:16px;
            font-weight:400;
          }
        }
        .time {
          margin-top: 20px;
          height:28px;
          line-height:28px;
          font-size:20px;
          font-weight:400;
          color:#7D7D7D;
        }
      }
      .order-state {
        position: absolute;
        right: 20px;
        top: 73px;
        height:34px;
        line-height:34px;
        font-size:24px;
        font-weight:600;
        color:#4A4A4A;

      }
    }
  }
  .list > .item > .right:last-child {
    border-bottom: 0 none;
  }
  .select-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
    z-index: 1000;
    .select-bg {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: -1;
      background-color: #000;
      opacity:0.4044;
    }
    .select-area {
      background-color: #fff;
    }
    .select-list {
      padding: 30px 20px 2px 20px;
    }
    .select-item {
      margin-bottom: 30px;
      height:37px;
      line-height:37px;
      font-size:26px;
      font-weight:400;
      color:#4A4A4A;
    }
    .select-item.cur {
      color: #C81722;
    }
  }
  .no-record {
    height: 200px;
    background-color: #fff;
    padding-top: 50px;
    text-align: center;
    font-size: 24px;
    color: #4A4A4A;
  }
</style>
