import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', redirect: '/index' },
        {
            path: '/index',
            name: 'index',
            meta: { title: '贷超' },
            component: () => import('../view/index')
        },
        {
            path: '/addBankNextStep',
            name: 'addBankNextStep',
            meta: { title: '贷超' },
            component: () => import('../view/addBankNextStep')
        }
    ]
})
