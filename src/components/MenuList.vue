<template>
  <div class="root">
    <div style="width: 100%; padding: 8px 0; background-color: #263445;">
      <el-row style="cursor: pointer;" @click.native="updateLeftMenuType">
        <el-col :span="5" style="text-align: right;">
          <img src="../assets/logo.png" style="width: 28px; height: 28px; margin: 2px; border-radius: 14px;">
        </el-col>
        <el-col :span="19" style="text-align: left; line-height: 32px;">
          <span style="color: white; font-size: 14px; margin-left: 8px;">系统控制台</span>
        </el-col>
      </el-row>
    </div>
    <div class="page-container" v-for="(menu, index) in menus" :key="index">
      <!-- 组菜单 -->
      <div v-if="menu.type === 'group'">
        <section @click="menu.open = !menu.open">
          <i :class="menu.icon"></i>
          <a href="javascript:void(0)" style="margin-left: 8px;">{{menu.name}}</a>
          <i :class="menu.open ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" style="float: right;"></i>
        </section>
        <el-collapse-transition>
          <div v-show="menu.open">
            <p v-for="(item, index) in menu.items" :key="index" v-show="item.path.length > 1">
              <router-link :to="item.path">{{item.name}}</router-link>
            </p>
          </div>
        </el-collapse-transition>
      </div>
      <!-- 独立菜单 -->
      <div v-else-if="menu.type === 'item'">
        <p>
          <i :class="menu.icon"></i>
          <router-link :to="menu.path">{{menu.name}}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import { MenusWhitNoIndex } from '../utils/MenuHelper.js'

export default {
  name: 'MenuList',
  data () {
    return {
      menus: []
    }
  },
  mounted () {
    this.$data.menus = MenusWhitNoIndex(true)
  },
  methods: {
    /* 主页左边改变菜单类型 */
    updateLeftMenuType: function () {
      this.$store.commit('updateLeftMenuType', !this.$store.state.leftMenuTypeStandard)
    },
    /* 查找菜单的分组 */
    findGroup: function (menu, path) {
      let group = null
      if (menu == null || menu.length <= 0) {
        return group
      }
      menu.forEach(g => { // 菜单固定只有两级
        if (g.type === 'group') {
          g.items.forEach(i => {
            if (i.path === path) {
              group = g
            }
          })
        }
      })
      return group
    }
  },
  watch: {
    $route (to, from) {
      let group = this.findGroup(this.$data.menus, to.path)
      if (group != null && group.open === false) { // 子菜单被点击了,组菜单没有展开则强制展开
        group.open = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-container {
    width: 200px;
    text-align: left;
    color: #BFCBD9;

    div {
      /* 组标题 */
      section {
        padding: 16px 16px;
        font-size: 16px;

        a {
          font-weight: bold;
          color: #BFCBD9;
          text-decoration: none;
          font-size: 14px;

          &:hover {
            color: #409EFF;
          }
        }

        &:hover {
          background-color: #263445;
        }
      }

      /* 组内子菜单 */
      div {
        background-color: #1F2D3D;

        p {
          margin: 0;
          padding: 16px 16px 16px 32px;

          &:hover {
            background-color: #000B28;
          }

          a {
            display: block;
            width: 100%;
            height: 100%;
            font-weight: bold;
            color: #BFCBD9;
            text-decoration: none;
            font-size: 14px;

            &.router-link-exact-active {
              color: #409EFF;
            }

            &:hover {
              color: #409EFF;
            }
          }
        }
      }

      /* 独立菜单 */
      p {
        padding: 16px 16px;
        margin: 0;
        font-size: 16px;

        a {
          font-weight: bold;
          color: #BFCBD9;
          text-decoration: none;
          font-size: 14px;
          margin-left: 8px;

          &.router-link-exact-active {
            color: #409EFF;
          }

          &:hover {
            color: #409EFF;
          }
        }

        &:hover {
          background-color: #263445;
        }
      }
    }
  }
</style>
