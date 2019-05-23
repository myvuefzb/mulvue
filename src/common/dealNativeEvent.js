var platformAdapter = {
    callback: function (fun, obj = '', json = {}) {
        platformAdapter[fun](json)
    },
    getUserInfo: function (data) {
        console.log('getUserInfo success：' + JSON.stringify(data))
        localStorage.setItem('getUserInfo', JSON.stringify(data))
    },
    getDeviceInfo: function (data) {
        console.log('getDeviceInfo success：' + JSON.stringify(data))
        localStorage.setItem('getDeviceInfo', JSON.stringify(data))
    }
}
window.platformAdapter = platformAdapter
if (window.Vue) {
    window.Vue.use(platformAdapter)
}

export default {
    platformAdapter
}
