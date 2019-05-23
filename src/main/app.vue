<template>
  <div id="app">
    <transition name="page">
      <router-view  class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
      data () {
          return {
              gradeClass: 'ios'
          }
      },
      created () {
          // 不同的类型适用不同的类型页面切换效果
          if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
              this.gradeClass = 'ios'
          } else {
              this.gradeClass = 'android'
          }
          document.querySelector('body').className = this.gradeClass
      },
      // dynamically set transition based on route change
      watch: {
          $route (to, from) {
              const toDepth = to.path.split('/').length
              const fromDepth = from.path.split('/').length
              const root = document.getElementById('app')
              if (to.meta.title) { // 设置导航标题
                  document.title = to.meta.title
              }
              if (toDepth < fromDepth) {
                  root.setAttribute('transition-direction', 'back')
              } else {
                  root.setAttribute('transition-direction', 'forward')
              }
          }
      }
  }
</script>

<style lang='postcss'>
body,html,#app{
  height: 100%;
}
.child-view {
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 1px;
  transition: all .3s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  transform: translate(100%, 0);
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
