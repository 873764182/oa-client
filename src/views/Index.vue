<template>
  <div>
    <h3>首页</h3>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {}
  },
  mounted () {
    if (this.$store.getters.isLogin) {
      this.$router.replace({ path: '/home' })
    } else {
      this.$router.replace({ path: '/login' })
    }
  }
}
</script>

<style scoped>

</style>
