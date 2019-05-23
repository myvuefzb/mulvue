<!-- 输入框公共组件 -->
<template>
    <div class="input-wrapper">
      <input
        class="input"
        :type="type"
        :maxlength="max"
        :value="inputValue"
        :placeholder="placeholder"
        @input="changeHandle($event)"
        @blur="onBlurHandle"
      />
    </div>
</template>

<script>
/* eslint-disable */ 
  import {inputMask} from '@/utils'
  import REGULAR from '@/utils/regular.js'
  export default {
    name: 'InputItem',
    props: {
      /* 输入框类型，必填，默认text类型 */
      type: {
        type: String,
        required: true,
        default: 'text'
      },
      /* 输入框placeholder值 */
      placeholder: {
        type: String
      },
      /* 输入框内容改变方法 */
      onChange: {
        type: Function,
        required: true
      },
      /* 失去焦点方法 */
      onBlur: {
        type: Function
      },
      /* 最大输入字符限制 */
      max: {
        type: String
      },
      /* 输入类型 */
      isType: {
        type: String
      },
      /* 输入框值 */
      value: {
        type: String
      },
      mask: {
        type: Number
      }
    },
    data () {
      return {
        /* 输入框值 */
        inputValue: this.value
      }
    },
    watch: {
      value: function (newValue) {
        if (this.mask) {
          this.inputValue = inputMask(newValue.replace(REGULAR.space, ''), this.mask)
        } else {
          this.inputValue = newValue
        }
      }
    },
    methods: {
      /* 输入框改变方法 */
      changeHandle (e) {
        let value = e.target.value
        if (this.isType && this.isType === 'number') {
          value = value.replace(REGULAR.noNumber, '') // 过滤非数字
        }
        value = value.replace(REGULAR.space, '') // 过滤空格
        if (this.mask) {
          e.target.value = inputMask(value, this.mask)
          this.inputValue = e.target.value
          this.onChange(this.inputValue.replace(REGULAR.noNumber, ''))
        } else {
          this.inputValue = value
          this.onChange(this.inputValue)
        }
      },
      onBlurHandle () {
        this.onBlur && this.onBlur()
      }
    }
  }
</script>

<style scoped lang="less">
  .input-wrapper {
    background-color: #fff;
  }
  .input {
    display: block;
    width: 100%;
    height:100px;
    text-indent: 22px;
    font-size: 30px;
    font-weight:400;
    color: #4A4A4A;
    border: 0 none;
    box-sizing: border-box;
    border-radius:6px;
  }
</style>
