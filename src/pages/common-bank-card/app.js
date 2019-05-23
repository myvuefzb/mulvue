import router from './router'
import Vue from 'vue'
import App from './../../main/main.js'
// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
