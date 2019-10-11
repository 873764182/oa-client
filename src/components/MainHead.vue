<template>
  <div class="root">
    <el-row class="title-view">
      <el-col :span="1" style="margin-top: 14px;">
        <i class="el-icon-s-fold menu-button"
           @click="updateLeftMenuType" v-show="$store.state.leftMenuTypeStandard"></i>
        <i class="el-icon-s-unfold menu-button"
           @click="updateLeftMenuType" v-show="!$store.state.leftMenuTypeStandard"></i>
      </el-col>
      <el-col :span="11" style="text-align: left; padding-top: 19px;">
        <el-breadcrumb separator="/" style="width: 100%;">
          <el-breadcrumb-item>
            <router-link :to="mIndexPath">首页</router-link>
          </el-breadcrumb-item>
          <transition name="el-zoom-in-center">
            <section v-show="headTitleShow">
              <el-breadcrumb-item>{{headGroupName}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{headItemName}}</el-breadcrumb-item>
            </section>
          </transition>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12" class="head-right">
        <div v-show="!searchViewShow">
          <img src="../assets/search.svg" @click="searchViewShow = !searchViewShow" title="搜索"
               style="display: inline-block; width: 25px; height: 25px; margin: 8px 0; padding: 4px; cursor: pointer;"/>
        </div>
        <div v-show="searchViewShow">
          <el-popover
            ref="searchPopover"
            placement="bottom"
            width="100"
            trigger="hover">
            <div v-for="(data, index) in searchData" :key="index" class="search-result">
              <div>
                <router-link :to="data.path">{{data.name}}</router-link>
              </div>
              <span>{{data.fullName}}</span>
            </div>
          </el-popover>
          <input type="text"
                 v-popover:searchPopover
                 v-model="searchInput"
                 @blur="searchViewShow = false"
                 placeholder="Search"
                 ref="searchView"
                 autofocus/>
        </div>
        <div>
          <img src="../assets/screen.svg" @click="doBrowserFullscreen" title="全屏"
               style="display: inline-block; width: 25px; height: 25px; margin: 8px 0; padding: 4px; cursor: pointer;"/>
        </div>
        <div>
          <el-dropdown trigger="hover" @command="handleCommandUser">
            <img :src="userHeadPhoto" class="user-photo-view"/>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>{{$store.getters.userName}}</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-custom" command="0">个人中心</el-dropdown-item>
              <el-dropdown-item icon="el-icon-attract" command="1">接口文档</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button" divided command="2">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <section style="width: 100%; height: 1px; background-color: #eeeeee; box-shadow: #eeeeee 2px 2px 2px;">&nbsp;
    </section>
    <div class="title-nav">
      <label v-for="(tab, index) in tabList" :key="index" @click="doTabClick(tab.path)">
        <el-dropdown @command="tabHandleCommand">
          <span v-show="$store.state.headCurrentRoute === tab.path" style="background-color: #42b983; color: #fefefe">
            <strong>●</strong>
            <label>{{tab.name}}</label>
            <i class="el-icon-close" @click.stop="subTab(tab)"
               v-show="(tab.path !== mIndexPath && tab.path !== '/')"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="tabHandleData(tab, 0)">刷新标签</el-dropdown-item>
            <el-dropdown-item :command="tabHandleData(tab, 1)">关闭其他</el-dropdown-item>
            <el-dropdown-item :command="tabHandleData(tab, 2)">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span v-show="$store.state.headCurrentRoute !== tab.path">
          <label>{{tab.name}}</label>
          <i class="el-icon-close" @click.stop="subTab(tab)"
             v-show="(tab.path !== mIndexPath && tab.path !== '/')"></i>
        </span>
      </label>
    </div>
    <section style="width: 100%; height: 1px; background-color: #eeeeee; box-shadow: #eeeeee 1px 1px 5px;">&nbsp;
    </section>
  </div>
</template>

<script>

import { indexPath, refreshView } from '../store.js'
import { IndexPage, RouterList, RouterName, SearchResult } from '../utils/MenuHelper.js'
import { ExitFullscreen, LaunchFullscreen } from '../utils/PublicFunction'

export default {
  name: 'MainHead',
  data () {
    return {
      watchTabs: RouterList(),
      tabList: this.$store.state.headNavTabs,
      headGroupName: '',
      headItemName: '',
      headTitleShow: true,
      searchViewShow: false,
      searchData: SearchResult(''),
      searchInput: '',
      mIndexPath: indexPath,
      mRefreshView: refreshView
    }
  },
  mounted () {
    let index = IndexPage()
    if (index != null) { // 将默认首页添加进入导航栏
      this.addTab({ name: index.name, path: index.path })
    }
    setTimeout(() => {
      // 主动设置标题文本,让标题文本生效
      this.updateTitle(this.$route.path)
    }, 100)
  },
  methods: {
    /* 浏览器全屏设置 */
    doBrowserFullscreen: function () {
      if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
        ExitFullscreen()
      } else {
        LaunchFullscreen()
      }
    },
    /* 主页左边改变菜单类型 */
    updateLeftMenuType: function () {
      this.$store.commit('updateLeftMenuType', !this.$store.state.leftMenuTypeStandard)
    },
    /* 是否是需要监听的路由路径 */
    isWatchRoute: function (path) {
      return this.$data.watchTabs.findIndex(tab => tab.path === path) !== -1
    },
    /* 标签点击 */
    doTabClick: function (path) {
      this.$router.push({ path: path })
    },
    /* 添加标签 */
    addTab: function (tab) {
      this.$store.commit('addHeadNavTab', tab)
    },
    /* 删除标签 */
    subTab: function (tab) {
      // 必须要延迟删除才能生效 执行删除
      setTimeout(() => {
        this.$store.commit('subHeadNavTab', tab)
      }, 100)
      // 是当前活跃状态的路由
      if (this.$store.state.headCurrentRoute === tab.path) {
        // 获取到被删除的标签下标索引
        let index = this.$data.tabList.findIndex(t => t.path === tab.path)
        // 准备打开的标签,默认打开前一个
        let readyIndex = index - 1
        // 但是被删除标签的后面还有标签的话就打开后一个
        if (index < this.$data.tabList.length - 1) {
          readyIndex = index + 1
        }
        // 获取被删除标签的前一个标签
        let nextTab = this.$data.tabList[readyIndex]
        // 打开下一个标签
        this.$router.push({ path: nextTab.path })
      } else {
        // 记住活跃标签
        let tempRoute = this.$store.state.headCurrentRoute.toString()
        // 点击切换到需要删除的标签,因为删除标签缓存需要把标签先设置为活跃状态才能拿到组件实例
        this.doTabClick(tab.path)
        // 删除完成后跳转回之前的活跃标签
        this.$router.push({ path: tempRoute })
      }
    },
    /* 更新标题栏标签文本 */
    updateTitle: function (path) {
      this.$data.headTitleShow = false
      let titleValue = RouterName(path)
      this.$data.headGroupName = titleValue.groupName
      this.$data.headItemName = titleValue.itemName
      setTimeout(() => {
        this.$data.headTitleShow = true
      }, 200)
    },
    tabHandleCommand: function (command) {
      // 读取由计算属性封装由控件传递的数据
      let index = command.index
      let tab = command.tab
      // 找到当前页面的下标
      let indexCurrent = this.$data.tabList.findIndex(t => t.path === tab.path)

      switch (index) {
        case 0: // 刷新页面
          this.$store.commit('updateRefreshNavTabs', true)
          this.$router.replace({ path: refreshView })
          setTimeout(() => {
            this.$router.replace({ path: tab.path })
          }, 300)
          break
        case 1: // 关闭其他
          this.$data.tabList.forEach((item, ind, arr) => { // 循环删除标签
            if (ind !== 0 && ind !== indexCurrent) { // 不能删除首页与当前页面标签
              this.subTab(item)
            }
          })
          break
        case 2: // 关闭所有
          this.$data.tabList.forEach((item, ind, arr) => { // 循环删除标签
            if (ind !== 0 && ind !== indexCurrent) { // 不能删除首页
              this.subTab(item)
            } else if (ind !== 0 && ind === indexCurrent) {
              setTimeout(() => {
                this.subTab(item) // 最后一个标签需要延迟删除，不然会不能自动跳到首页标签
              }, 200)
            }
          })
          break
        default:
          console.log(JSON.stringify(command))
          break
      }
    },
    handleCommandUser: function (command) {
      if (command === '0') {
        this.$router.push({ path: this.$data.mIndexPath })
      } else if (command === '1') {
        this.$router.push({ path: '/system/docs' })
      } else if (command === '2') {
        this.$confirm('您确定要退出系统？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.doLogout()
        })
      }
    },
    doLogout: function () {
      this.$store.commit('doLogout', {})
      setTimeout(() => {
        this.$router.replace({ path: '/' })
      }, 500)
    }
  },
  watch: {
    searchViewShow: function (o, n) {
      if (o) {
        setTimeout(() => { // 需要延迟,不然可能设置焦点事件失效
          this.$refs.searchView.focus()
        }, 500)
      }
    },
    $route (to, from) {
      if (this.isWatchRoute(to.path)) {
        this.addTab({ name: to.name, path: to.path })
        this.updateTitle(to.path)
        this.$store.commit('updateCurrentRoute', to.path)
      } else {
        // console.log('非监听的路由路径 -> ' + to.path)
      }
    },
    searchInput: function () { // 搜索监听
      this.$data.searchData = SearchResult(this.$data.searchInput)
    }
  },
  computed: {
    tabHandleData: function () {
      return function (tab, index) {
        return { tab: tab, index: index }
      }
    },
    userHeadPhoto: function () {
      let photo = this.$store.getters.userInfo.photo
      if (photo === undefined || photo.length <= 0) {
        photo = '/favicon.ico' // 如果用户头像为空则提供默认图片
      }
      return photo
    }
  }
}
</script>

<style lang="scss" scoped>
  .title-view {
    width: 100%;
    height: 50px;
    background-color: white;
    text-align: left;

    i {
      text-decoration: none;
      color: #3F3F3F;
      margin-left: 16px;
    }
  }

  .menu-button {
    font-size: 24px;
    cursor: pointer;

    &:hover {
      color: #409EFF;
    }
  }

  .head-right {
    height: 50px;
    text-align: right;

    div {
      width: auto;
      height: 50px;
      margin: 0 5px;
      padding: 0;
      display: inline-block;
      line-height: 40px;

      img {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin: 5px 10px 5px 0;
        cursor: pointer;
        border-radius: 4px;

        &:hover {
          background-color: #efefef;
          box-shadow: #fefefe 1px 1px 1px;
          border-radius: 2px;
        }
      }

      input {
        margin: 0;
        width: 160px;
        padding: 0 8px;
        border-style: none none solid none;
        border-color: #5A5E66;
        border-width: 1px;
        outline: none;
        font-size: 14px;
        position: absolute;
        height: 30px;
        top: 10px;
        right: 120px;
        color: #999999;
      }
    }
  }

  .user-photo-view {
    &:hover {
      width: 36px;
      height: 36px;
      border-width: 2px;
      border-color: #BEC9D6;
      border-style: solid;
      border-radius: 2px;
    }
  }

  .title-nav {
    text-align: left;
    width: 95%;
    margin-left: 10px;
    height: auto;
    padding: 4px 0 6px 0;
    background-color: #fefefe;
    overflow: hidden;
    position: relative;
    white-space: nowrap;

    label {
      span {
        border: 1px solid #eeeeee;
        margin: 4px;
        padding: 4px 2px 4px 4px;
        cursor: pointer;
        font-size: 12px;
        color: #000;

        strong {
          font-size: 16px;
          margin-right: 2px;
        }

        label {
          padding-right: 4px;
        }

        i {
          margin: 0 2px 0 0;
          padding: 2px;
          font-size: 12px;

          &:hover {
            background-color: #fefefe;
            color: #42b983;
            border-radius: 16px;
          }
        }
      }
    }
  }

  .search-result {
    padding: 8px;
    margin: 0;
    /*cursor: pointer;*/

    &:hover {
      background-color: #efefef;
      border-radius: 8px;
    }

    div {
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;

      a {
        font-weight: bold;
        color: #BFCBD9;
        text-decoration: none;
        font-size: 14px;
        margin-left: 8px;

        &:hover {
          color: #42b983;
        }

        &.router-link-exact-active {
          color: #42b983;
        }
      }
    }

    span {
      font-size: 12px;
      color: #b4b4b4;
      margin-left: 8px;
    }
  }
</style>
