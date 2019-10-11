<template>
  <div class="root" style="min-width: 1024px; overflow-x: hidden;" ref="rootView">
    <el-container>
      <el-aside style="width: auto;height: auto; min-width: 40px; min-height: 100vh; background-color: #304156;">
        <MenuList v-show="leftMenuState"/>
        <MenuListMini v-show="!leftMenuState"/>
      </el-aside>
      <el-container>
        <el-header style="width: 100%; height: auto; padding: 0;">
          <MainHead ref="headerView"/>
        </el-header>
        <el-main class="main-style" :style="{height: mainHeight + 'px', maxHeight: mainHeight + 'px'}">
          <transition name="el-fade-in">
            <keep-alive :max="100">
              <router-view/>
            </keep-alive>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import MenuList from '../components/MenuList'
import MainHead from '../components/MainHead'
import MenuListMini from '../components/MenuListMini'

export default {
  name: 'home',
  data () {
    return {
      bodyHeight: document.documentElement.clientHeight,
      mainHeight: 500
    }
  },
  mounted () {
    if (!this.$store.getters.isLogin) {
      this.$message.error('请先登录')
      setTimeout(() => {
        this.$router.replace({ path: '/' })
      }, 500)
    } else {
      this.$nextTick(() => {
        this.initWindowsSize()
      })
    }
    window.onresize = () => {
      this.initWindowsSize()
    }
  },
  methods: {
    initWindowsSize () {
      // 获取标题区域的高度
      let head = this.$refs.headerView.$el.offsetHeight
      // 获取屏幕的高度
      this.$data.bodyHeight = document.documentElement.clientHeight
      // 屏幕的宽度
      let clientWidth = document.documentElement.clientWidth
      // 使用的高度,判断窗口宽度是否小于要求的最小宽度,小于会出现横向滚动条,要加上17px滚动条的宽度才能满屏
      if (clientWidth > 1024) {
        this.$data.mainHeight = (this.$data.bodyHeight - head)
      } else {
        this.$data.mainHeight = (this.$data.bodyHeight - head + 17)
      }
      // this.$data.mainHeight = (this.$data.bodyHeight - head)
    }
  },
  computed: {
    leftMenuState: function () {
      return this.$store.state.leftMenuTypeStandard
    }
  },
  components: { MenuList, MainHead, MenuListMini }
}
</script>

<style lang="scss" scoped>
  .main-style {
    width: 100%;
    max-width: 100%;
    /*height: 100%;*/
    /*min-height: 600px;*/
    /*max-height: 100%;*/
    margin: 0;
    padding: 0;
    background-color: #fefefe;

    div {
      width: 100%;
      height: 100%;
    }
  }
</style>
