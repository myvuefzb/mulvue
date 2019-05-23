<!-- 推荐赚钱 -->
<template>
  <section class="recommend">
    <img class="recommend-img" :src="playbill" alt="">
    <a class="recommend-btn" href="javascript:;" @click="share">招贤纳士</a>
  </section>
</template>

<script>
/*eslint-disable */
  import playbill from '@/assets/pic/playbill@2x.png' // 推广海报
  import Native from '@/common/native.js'
  import {getShareuri} from '@/api/wechat'
  export default {
    name: 'Recommend', // 推荐赚钱
    data () {
      return {
        playbill,
        /* 用户信息 */
        userInfo: JSON.parse(localStorage.getItem('getUserInfo')),
        /* 分享数据 */
        shareData: null
      }
    },
    created () {
      console.log(111111111)
      console.log(this.userInfo)
      this.getShareUrl()
      /* 设置头部 */
      Native.NUI.setHeader({
        title: '推荐赚钱',
        isBack: true
      })
    },
    methods: {

      /* 获取分享链接 */
      async getShareUrl () {
        let params = {
          unionUserId: this.userInfo.unionUserId,
          redirectUri: 'http://font.tekuaikeji.com:17081/sales/' + '/#/join-us' + '?unionUserId=' + this.userInfo.unionUserId
        }
        Native.NUI.loading({
          text: '加载中...'
        })
        let data = await getShareuri(params)
        Native.NUI.loadFinish()
        if (data && data.ret === '0') {
          let dataObj = data.data
          this.shareData = dataObj
        } else {
          Native.NUI.tip({
            text: data.message
          })
        }
      },
      share(){
        Native.NUI.share({
          title: this.shareData.title,
          image: this.shareData.imgUrl,
          content: this.shareData.desc,
          url: this.shareData.link
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .recommend {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
    .recommend-img {
      width: 92%;
      height: auto;
      max-height: 923px;
      background:#D8D8D8;
      box-shadow:0px 9px 18px 2px rgba(0,0,0,0.29);
      border-radius:15px;
    }
    .recommend-btn {
      /*display: block;
      margin: 130px auto 0;*/
      position: absolute;
      left: 50%;
      bottom: 56px;
      margin-left: -139px;
      width:278px;
      height:100px;
      line-height: 100px;
      font-size:26px;
      font-weight:400;
      color:#fff;
      background-color: #A50000;
      box-shadow:0px 6px 19px -2px rgba(0,0,0,0.17);
      border-radius:6px;
    }
  }

</style>
