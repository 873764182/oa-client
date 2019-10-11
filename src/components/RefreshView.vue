<template>
  <div class="root">
    <section v-loading="loadingView" style="height: 500px;">
      &nbsp;
    </section>
  </div>
</template>

<script>
export default {
  name: 'RefreshView',
  data () {
    return {
      loadingView: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.$data.loadingView = true
    }, 300)
  }
}
</script>

<style scoped>

</style>
