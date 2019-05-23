<!-- 输入框公共组件 -->
<template>
    <div class="submit-item-wrap">
      <img class="left-icon"  :src="leftIcon"/>
      <group>
        <x-input class="context-input" :class="{'isShow-right-icon':showRightIcon}" v-model="inputModel" 
        :disabled="canDisable"
        :debounce= "debounce"
        @on-change="onChange"
        :show-clear="false"
        :type="type" 
        :placeholder="placeholder"
        :placeholder-align= "placeholderAlign"
        :max="getMaxLength"
        >
        </x-input>
      </group>
      <img class="right-icon" v-show="showRightIcon" :src="rightIcon" @click="rightIconEvent" />
    </div>
</template>

<script>
/* eslint-disable */ 
  import { Group, XInput } from 'vux'
  import iconName from '@/assets/icon/icon-name@2x.png' 
  import iconPhotograph from '@/assets/icon/icon-photograph@2x.png' 
  console.log("图标2：" + iconPhotograph)
  console.log("图标1：" + iconName)
  export default {
    name: 'submit-item',
    components: {
      Group,
      XInput
    },
    props: {
      canDisable: {
        type: Boolean,
        default: false
      },
      leftIcon: {
        type: String,
        default: iconName
      },
      value: {
        type: String
      },
      rightIcon: {
        type: String,
        default: iconPhotograph
      },
      showRightIcon: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: '请输入本人的真实姓名'
      },
      placeholderAlign: {
        type: String,
        default: 'left'
      },
      debounce: {
        type: Number,
        default: 1000
      },
      inputChange: {
        type: Function
      },
      rightIconEventCallback: {
        type: Function
      },
      rightIconEventParam: {
        type: Object
      },
      getMaxLength: {
        type: Number,
        default: 100000000000000
      }
    },
    computed: {
      inputModel: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('updateValue', value)
        }
      }
    },
    data () {
      return {
        
      }
    },
    methods: {
      onChange: function () {
        this.inputChange && this.inputChange(this.inputModel)
      },
      rightIconEvent: function () {
        if (this.showRightIcon) {
          let p = this.rightIconEventParam
          this.rightIconEventCallback && this.rightIconEventCallback(this.inputModel,p)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .submit-item-wrap {
    position: relative;
    padding-left: 70px;
    .context-input {
      height: 78px;
      text-indent: 22px;
      font-size: 30px;
      font-weight:400;
      color: #4A4A4A;
      border: 0 none;
      box-sizing: border-box;
      border-radius:6px;
    }
    .isShow-right-icon {
      padding-right: 100px;
    }
    .left-icon {
      display: block;
      width: 44px;
      height: 44px;
      position: absolute;
      left: 0px;
      top: 16px;
    }
    .right-icon {
      display: block;
      width: 44px;
      height: 33px;
      position: absolute;
      right: 20px;
      top: 22px;
    }
  }
  
</style>
