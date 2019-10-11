<template>
  <div class="root">
    <h3>抱歉,页面不存在</h3>
    <el-button size="mini" type="primary" round @click.native="$router.go(-1)">返回</el-button>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>

<style scoped>

</style>
