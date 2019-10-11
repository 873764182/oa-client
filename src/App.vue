<template>
  <div id="app">
    <transition name="el-zoom-in-center">
      <router-view/>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {}
  },
  components: {}
}
</script>

<style lang="scss">
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: PingFang SC, Lantinghei SC, Helvetica Neue, Helvetica, Arial, Microsoft YaHei, \\5FAE\8F6F\96C5\9ED1, STHeitiSC-Light, simsun, \\5B8B\4F53, WenQuanYi Zen Hei, WenQuanYi Micro Hei, "sans-serif";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .root {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
