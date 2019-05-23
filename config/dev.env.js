'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://10.31.1.31:10001"' // 测试环境: http://10.31.1.31:10001 ,预生产地址: http://dcpre.tekuaikeji.com
})
