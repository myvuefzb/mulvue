import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', redirect: '/index' },
        {
            path: '/index',
            name: 'index',
            meta: { title: '完善个人信息' },
            component: () => import('../view/index')
        },
        {
            path: '/firstStep',
            name: 'firstStep',
            meta: { title: '完善个人信息' },
            component: () => import('../view/firstStep')
        },
        {
            path: '/nextStep',
            name: 'nextStep',
            meta: { title: '完善个人信息' },
            component: () => import('../view/nextStep')
        }
    ]
})
