<template>
  <div class="hello">

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      componentName: this.$route.name
    }
  },
  mounted () {
    console.log('这是 HelloWorld 组件 mounted ' + this.$data.componentName)
  }
}
</script>

<style scoped lang="scss">

</style>
