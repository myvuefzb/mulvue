import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        // { path: '*', redirect: '/404' },
        // { path: '/404', component: () => import('@/views/error-page/404') },
        { path: '/', redirect: '/index' },
        {
            path: '/index',
            name: 'index',
            meta: { title: 'project' },
            component: () => import('../view/index')
        }
    ]
})
