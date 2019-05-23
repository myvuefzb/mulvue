import router from './router'
import Vue from 'vue'
import {ToastPlugin, LoadingPlugin} from 'vux'
import App from './../../main/main.js'
import '@/styles/base.less'

/* toast插件 */
Vue.use(ToastPlugin)
Vue.use(ToastPlugin, {position: 'top'})
Vue.use(LoadingPlugin)

// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
