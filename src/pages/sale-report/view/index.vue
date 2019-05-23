<!-- 报表列表页 -->
<template>
  <section class="report">
    <header class="head-search">
      <flexbox class="search-list" :gutter="0">
        <flexbox-item>
          <div class="search-item" @click="selectReportState">
            <strong>营业报表</strong>
            <span>
            <i class="arrow-bottom"></i>
          </span>
          </div>
        </flexbox-item>
        <flexbox-item v-if="selectInfo.isShow">
          <div class="search-item"  @click="selectPersonnel">
            <strong>{{selectInfo.current.name}}</strong>
            <span>
            <i class="arrow-bottom"></i>
          </span>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="search-item" @click="selectTimeState">
            <strong>{{currentDate.title}}</strong>
            <span>
            <i class="arrow-bottom"></i>
          </span>
          </div>
        </flexbox-item>
      </flexbox>
      <div class="time-wrap">
        <div class="date" v-show="currentDate.name === 'date'"><time @click="slectDate">{{date}}</time></div>
        <div class="mouth" v-show="currentDate.name === 'month'"><time @click="slectMonth">{{month}}</time></div>
        <div class="date-area" v-show="currentDate.name === 'date-area'"><time @click="slectDateAreaStart">{{dateArea.start}}</time><span>至</span><time  @click="slectDateAreaEnd">{{dateArea.end}}</time></div>
        <div class="time-area" v-show="currentDate.name === 'time-area'"><time @click="slectTimeAreaStart">{{timeArea.start}}</time><span>至</span><time @click="slectTimeAreaEnd">{{timeArea.end}}</time></div>
      </div>
    </header>
    <div class="content">
      <div class="no-record">暂无数据</div>
    </div>
    <div class="select-dialog" v-show="dialogShow">
      <div class="select-bg" @click="dialogHide"></div>
      <div class="select-area" v-show="reportStateShow">
        <ul class="select-list">
          <li class="select-item cur">全部状态</li>
          <li class="select-item">申请成功</li>
          <li class="select-item">申请处理中</li>
          <li class="select-item">申请失败</li>
        </ul>
      </div>
      <div class="select-area" v-if="selectInfo.isShow && selectInfo.content === '门店'" v-show="personnelShow">
        <ul class="select-list">
          <li class="select-item" :class="{'cur': selectInfo.current.id === item.storeId}"  v-for="(item) in selectInfo.listData" :key="item.storeId" @click="selectStoreData(item)">{{item.storeName}}</li>
        </ul>
      </div>
      <div class="select-area" v-if="selectInfo.isShow && selectInfo.content === '业务员'" v-show="personnelShow">
        <ul class="select-list">
          <li class="select-item" :class="{'cur': selectInfo.current.id === item.saleId}"  v-for="(item) in selectInfo.listData" :key="item.saleId" @click="selectSalesData(item)">{{item.realName}}</li>
        </ul>
      </div>
      <div class="select-area" v-show="timeSelectShow">
        <ul class="select-list">
          <li class="select-item" :class="{'cur': currentDate.name === item.name}" v-for="item in dateData" :key="item.name" @click="selectTimeHandle(item)">{{item.title}}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
/*eslint-disable */
  import { Flexbox, FlexboxItem } from 'vux'
  import {queryStores, querySales} from '@/api/home'
  import {getUserRole} from '@/utils/index'
  import Native from '@/common/native.js'
  const now = new Date()
  export default {
    name: 'ReportList',
    components: {
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        dialogShow: false,
        reportStateShow: false,
        timeSelectShow: false,
        personnelShow: false,
        /* 用户信息，角色信息 */
        userInfo: JSON.parse(localStorage.getItem('getUserInfo')),
        userRole: getUserRole(),
        /* 选择门店、业务员是否显示 */
        selectInfo: {
          isShow: false,
          showModule: '',
          content: '',
          listData: null,
          current: ''
        },
        /* 日期数据 */
        currentDate: {
          name: 'date',
          title: '日汇总'
        },
        dateData: [
          {
            name: 'date',
            title: '日汇总'
          },
          {
            name: 'month',
            title: '月汇总'
          },
          {
            name: 'date-area',
            title: '自定义日期'
          },
          {
            name: 'time-area',
            title: '自定义时间'
          }
        ],
        date: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
        month: now.getFullYear() + '-' + (now.getMonth() + 1),
        dateArea: {
          start: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
          end: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
        },
        timeArea: {
          start: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes(),
          end: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes()
        }
      }
    },
    created () {
      /* 初始化 */
      this.init()
      /* 设置头部 */
      Native.NUI.setHeader({
        title: '报表',
        isBack: true
      })
    },
    methods: {
      /* 初始化方法 */
      init () {
        let role = this.userRole
        // let role = 'storeManager'
        if (role === 'boss') { // 老板
          this.selectInfo.isShow = true
          this.selectInfo.content = '门店'
          /* 获取门店列表数据 */
          this.getStoreList()
        } else if (role === 'storeManager') { // 店长
          this.selectInfo.isShow = true
          this.selectInfo.content = '业务员'
          /* 获取业务员列表数据 */
          this.getSalesList()
        } else if (role === 'salesman') { // 业务员
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
          this.selectInfo.listData = data.data
          this.selectInfo.current = data.data[0]
          this.selectInfo.current = {
            id: data.data[0].storeId,
            name: data.data[0].storeName
          }
        } else {
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
          this.selectInfo.listData = data.data
          this.selectInfo.current = {
            id: data.data[0].saleId,
            name: data.data[0].realName
          }
        } else {
          Native.NUI.tip({
            text: data.message
          })
        }
      },
      selectReportState () {
        /* this.dialogShow = !this.dialogShow
        this.reportStateShow = this.dialogShow */
      },
      selectTimeState () {
        this.dialogShow = !this.dialogShow
        this.timeSelectShow = this.dialogShow
      },
      selectPersonnel () {
        this.dialogShow = !this.dialogShow
        this.personnelShow = this.dialogShow
      },
      dialogHide () {
        this.dialogShow = false
        this.reportStateShow = false
        this.timeSelectShow = false
        this.personnelShow = false
      },
      /*  */
      selectTimeHandle (item) {
        this.currentDate = item
        this.dialogHide()
      },
      /* 选择日期 */
      slectDate () {
        const self = this
        this.$vux.datetime.show({
          value: self.date, // 其他参数同 props
          format: 'YYYY-MM-DD',
          confirmText: '确认',
          cancelText: '取消',
          onHide () {

          },
          /* onShow () {
            console.log(11111111)
          },
          onChange (value) {
            console.log(222222222)
            console.log(value)
          },
          onShadowChange () {
            console.log(555555)
          }, */
          onConfirm (value) {
            self.date = value
          }
        })
      },
      /* 选择月份 */
      slectMonth () {
        const self = this
        this.$vux.datetime.show({
          value: self.month, // 其他参数同 props
          format: 'YYYY-MM',
          confirmText: '确认',
          cancelText: '取消',
          onHide () {

          },
          /* onShow () {
            console.log(11111111)
          },
          onChange (value) {
            console.log(222222222)
            console.log(value)
          },
          onShadowChange () {
            console.log(555555)
          }, */
          onConfirm (value) {
            self.month = value
          }
        })
      },
      /* 自定义日期 */
      slectDateAreaStart () {
        const self = this
        this.$vux.datetime.show({
          value: self.dateArea.start, // 其他参数同 props
          format: 'YYYY-MM-DD',
          confirmText: '确认',
          cancelText: '取消',
          onHide () {

          },
          /* onShow () {
            console.log(11111111)
          },
          onChange (value) {
            console.log(222222222)
            console.log(value)
          },
          onShadowChange () {
            console.log(555555)
          }, */
          onConfirm (value) {
            self.dateArea.start = value
          }
        })
      },
      slectDateAreaEnd () {
        const self = this
        this.$vux.datetime.show({
          value: self.dateArea.end, // 其他参数同 props
          format: 'YYYY-MM-DD',
          confirmText: '确认',
          cancelText: '取消',
          onConfirm (value) {
            self.dateArea.end = value
          }
        })
      },
      /* 自定义时间 */
      slectTimeAreaStart () {
        const self = this
        this.$vux.datetime.show({
          value: self.timeArea.start, // 其他参数同 props
          format: 'YYYY-MM-DD HH:mm',
          confirmText: '确认',
          cancelText: '取消',
          onHide () {

          },
          onConfirm (value) {
            self.timeArea.start = value
          }
        })
      },
      slectTimeAreaEnd () {
        const self = this
        this.$vux.datetime.show({
          value: self.timeArea.end, // 其他参数同 props
          format: 'YYYY-MM-DD HH:mm',
          confirmText: '确认',
          cancelText: '取消',
          onConfirm (value) {
            self.timeArea.end = value
          }
        })
      },
      /* 选择店长 */
      selectStoreData (item) {
        if (this.selectInfo.current !== item.storeId) {
          this.selectInfo.current = {
            id: item.storeId,
            name: item.storeName
          }
          this.dialogHide()
        }
      },
      /* 选择业务员 */
      selectSalesData (item) {
        if (this.selectInfo.current !== item.saleId) {
          this.selectInfo.current = item
          this.selectInfo.current = {
            id: item.saleId,
            name: item.realName
          }
          this.dialogHide()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@/styles/variables.less';
  .report {
    min-height: 100%;
    background-color: #F9F9F9;
  }
  .head-search {
    height: 90px;
  }
  .search-item {
    text-align: center;
    strong {
      display: inline-block;
      height:40px;
      line-height:40px;
      font-size:26px;
      font-weight:400;
      color:#4A4A4A;
    }
    span {
      height: 40px;
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
  .time-wrap {
    margin-top: 10px;
    height:33px;
    line-height:33px;
    text-align: center;
    font-size:24px;
    color:#C81722;
  }
  .time-wrap strong {
    font-weight:500;
  }
  .time-wrap span {
    display: inline-block;
    margin: 0 38px;
    color:#4A4A4A;
  }
  .no-record {
    margin-top: 50px;
    text-align: center;
    font-size: 24px;
    color: #4A4A4A;
  }
  .select-dialog {
    position: fixed;
    top:0;
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
</style>
