<template>
  <div class="root">
    <el-row>
      {{count}}
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Weixin',
  data () {
    return {
      count: 0
    }
  },
  mounted () {
    setInterval(() => {
      this.$data.count++
    }, 1000)
  }
}
</script>

<style scoped>

</style>
