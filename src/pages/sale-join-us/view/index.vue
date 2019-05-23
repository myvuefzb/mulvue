<!-- 加入我们 -->
<template>
  <section class="recommend">
    <img :src="joinUs" alt="">
    <a href="javascript:;" @click="joinUsHandle"></a>
  </section>
</template>

<script>
/*eslint-disable */
  import joinUs from '@/assets/pic/join-us@2x.png' // 加入我们海报
  export default {
    name: 'JoinUs', // 加入我们
    components: {
    },
    data () {
      return {
        joinUs
      }
    },
    created () {
    },
    methods: {
      /* 加入我们点击事件 */
      joinUsHandle () {
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
    img {
      width: 100%;
      height: 100%;
    }
    a {
      position: absolute;
      left: 50%;
      bottom: 15.74212893553223%;
      width: 474px;
      height: 134px;
      margin-left: -237px;
      background: url('~@/assets/img/btn-joinUs@2x.png') no-repeat 0 0;
      background-size: cover;
    }
  }
</style>
