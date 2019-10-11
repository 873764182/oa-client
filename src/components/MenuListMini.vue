<template>
  <div class="root" style="width: 40px;">
    <div style="width: 100%; background-color: #263445;">
      <el-row style="cursor: pointer;" @click.native="updateLeftMenuType">
        <el-dropdown>
          <img src="../assets/logo.png" style="width: 20px; height: 20px; margin: 5px auto; border-radius: 10px;">
          <el-dropdown-menu slot="dropdown" :visible-arrow="false" class="menu-dropdown">
            <el-dropdown-item @click.native="updateLeftMenuType" style="color: #BFCBD9">控制台</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </div>
    <div class="menu-item" v-for="(menu, index) in menus" :key="index">
      <el-dropdown>
        <i :class="menu.icon"></i>

        <el-dropdown-menu
          class="menu-dropdown"
          slot="dropdown"
          v-if="menu.type === 'group'"
          :visible-arrow="false">
          <el-dropdown-item v-for="(item, index) in menu.items" :key="index">
            <router-link :to="item.path" class="router-class">{{item.name}}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>

        <el-dropdown-menu
          class="menu-dropdown"
          slot="dropdown"
          v-else-if="menu.type === 'item'"
          :visible-arrow="false">
          <el-dropdown-item>
            <router-link :to="menu.path" class="router-class">{{menu.name}}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>

import { MenusWhitNoIndex } from '../utils/MenuHelper.js'

const data = {
  menus: []
}

export default {
  name: 'MenuList',
  data () {
    return data
  },
  mounted () {
    this.$data.menus = MenusWhitNoIndex(true)
  },
  methods: {
    /* 主页左边改变菜单类型 */
    updateLeftMenuType: function () {
      this.$store.commit('updateLeftMenuType', !this.$store.state.leftMenuTypeStandard)
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-item {
    margin: 0;
    padding: 0;

    div {
      width: 100%;
      font-size: 20px;
      cursor: pointer;
      color: #BFCBD9;

      &:hover {
        color: #409EFF;
        background-color: #263445;
      }

      i {
        width: 100%;
        line-height: 45px;
      }
    }
  }

  .menu-dropdown {
    margin: -40px 0 0 35px;
    background-color: #263445;

    li {
      &:hover {
        color: #409EFF;
        background-color: #000B28;
      }
    }
  }

  .router-class {
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
</style>
