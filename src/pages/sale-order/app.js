import router from './router'
import Vue from 'vue'
import App from './../../main/main.js'
import '@/styles/base.less'
// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
