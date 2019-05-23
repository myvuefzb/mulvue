// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { ToastPlugin, LoadingPlugin, DatetimePlugin } from 'vux'
import App from './app.vue'
// eslint-disable-next-line no-unused-vars
import dealNativeEvent from '@/common/dealNativeEvent'
import '@/styles/base.less'
import VConsole from 'vconsole'
import Native from '@/common/native.js'
// eslint-disable-next-line no-unused-vars
let vConsole = new VConsole() // 初始化
Native.NRouter.userInfo({
    'callback': 'getUserInfo'
})
Native.NRouter.deviceInfo({
    'callback': 'getDeviceInfo'
})
// 加载vux全局插件
Vue.use(ToastPlugin)
Vue.use(ToastPlugin, {position: 'middle'})
Vue.use(LoadingPlugin)
Vue.use(DatetimePlugin)
export default App
