<!-- 验证码输入框公共组件 -->
<template>
    <div class="validate">
      <input
        class="validate-input"
        type="text"
        maxlength="6"
        placeholder="请输入验证码"
        v-model.trim.number="value"
        @input="changeHandle($event)"
      />
      <span class="validate-btn">
        <a href="javascript:;" @click="sendCode">
          <span v-show="!isShowTime">发送验证码</span>
          <span v-show="isShowTime">({{times}})s</span>
        </a>
      </span>
    </div>
</template>

<script>
/* eslint-disable */ 
  import REGULAR from '@/utils/regular.js'
  export default {
    name: 'InputValidate',
    props: {
      /* 发送验证码按钮是否可点击(当手机号码输入正确时可点击) */
      isSendCode: {
        type: Boolean,
        required: true
      },
      /* 是否可以倒计时 */
      isCountTimesSend: {
        type: Boolean,
        required: true
      },
      /* 倒计时时长，默认60 */
      countTimes: {
        type: Number,
        default: 60
      },
      /* 发送验证码方法 */
      sendValidateCode: {
        type: Function,
        required: true
      },
      /* 验证码改变方法 */
      onChange: {
        type: Function,
        required: true
      }
    },
    data () {
      return {
        times: this.countTimes, // 倒计时时长
        isShowTime: false, // 是否显示倒计时
        value: '' // 输入框值
      }
    },
    computed: {
      /* 是否显示倒计时 */
      /* isShowTime () {
        if (REGULAR.telphone.test(this.telphone) && REGULAR.verificationCode.test(this.validataCode) && REGULAR.password.test(this.password)) {
          return false
        } else {
          return true
        }
      } */
    },
    watch: {
      isCountTimesSend: function (newValue) {
        if (newValue) {
          this.isShowTime = !this.isShowTime
          this.countSms()
        }
      }
    },
    methods: {
      // 短信验证码倒计时
      countSms () { // 短信倒计时
        const timeout = () => {
          setTimeout(() => {
            this.times--
            if (this.times === 0) {
              this.isShowTime = false
              this.times = 60
            } else {
              timeout()
            }
          }, 1000)
        }
        timeout()
      },
      /* 点击发送验证码 */
      sendCode () {
        if (!this.isSendCode) {
          this.$vux.toast.show({
            type: 'text',
            text: '请输入正确的手机号码'
          })
          return false
        }
        if (this.isShowTime) {
          return false
        }
        /* 发送验证码方法回调 */
        this.sendValidateCode()
      },
      /* 验证码输入改变方法 */
      changeHandle (e) {
        /* 过滤非数字 */
        this.value = e.target.value = e.target.value.replace(REGULAR.noNumber, '')
        this.onChange(this.value)
      }
    }
  }
</script>

<style scoped lang="less">
.validate {
  border-radius:6px;
  background-color: #fff;
  .validate-input {
    display: block;
    width: 100%;
    height:100px;
    padding-right: 195px;
    text-indent: 22px;
    font-size: 30px;
    font-weight:400;
    color: #4A4A4A;
    border: 0 none;
    box-sizing: border-box;
    border-radius: 6px;
  }
  .validate-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 190px;
    height: 100px;
    text-align: center;
    border-left: 1px solid #BAB9B9;
    a {
      display: inline-block;
      margin-top: 29px;
      height:42px;
      line-height:42px;
      font-size:30px;
      font-weight:400;
      color: #A50000;
    }
  }
}
</style>
