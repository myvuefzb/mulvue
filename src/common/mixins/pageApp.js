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
        '$route' (to, from) {
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
