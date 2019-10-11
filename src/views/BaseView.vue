<template>
  <div class="root">

  </div>
</template>

<script>
export default {
  name: 'BaseView',
  created () {
    console.log('BaseView => beforeCreate ' + this.$route.name + ' : ' + this.$options.name)
  }
}
</script>

<style lang="scss" scoped>

</style>
