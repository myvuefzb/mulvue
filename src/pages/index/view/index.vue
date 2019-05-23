<template>
<div class="home">
    <group>
      <cell title="跳转至" value="调用拍照和选择相册功能（单选）" is-link @click.native="goLibQuery" style="height: 60px;"></cell>
      <cell title="跳转至" value="打开固定原生页面" is-link @click.native="goClientQuery" style="height: 60px;"></cell>
      <cell title="跳转至" value="打开原生页面加载loading" is-link @click.native="goClinetFollow" style="height: 60px;"></cell>
    </group>
</div>
</template>
<script>
import { Group, Cell, CellBox } from 'vux'
export default {
    components: {
        Group,
        Cell,
        CellBox
    },
    methods: {
    },
    mounted () {

    }
}
</script>
<style lang='less' scoped>

</style>
