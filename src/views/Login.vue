<template>
  <div class="root" style="background-color: #2D3A4B; width: 100vw; height: 100vh;">
    <el-row style="padding-top: 20vh; color: #fefefe">
      <h1>登录控制台</h1>
    </el-row>
    <el-row>
      <div class="row-style">
        <el-input
          ref="usernameInput"
          v-model="username"
          maxlength="11"
          show-word-limit
          prefix-icon="el-icon-user-solid"
          placeholder="电话" clearable autofocus
          @keyup.enter.native="doLogin"/>
      </div>
    </el-row>
    <br>
    <el-row>
      <div class="row-style">
        <el-input
          ref="passwordInput"
          v-model="password"
          maxlength="12"
          prefix-icon="el-icon-s-cooperation"
          placeholder="密码"
          clearable show-password
          @keyup.enter.native="doLogin"/>
      </div>
    </el-row>
    <br>
    <el-row v-permission="apis.lad">
      <div class="row-style">
        <el-button type="primary" style="width: 100%; height: 40px;" @click="doLogin">登陆</el-button>
      </div>
    </el-row>
    <br>
    <el-row class="row-style">
      <el-col :span="20">
        <p style="color: #fefefe; font-size: 12px; position: absolute; left: 0;">
          点击右边按钮获取账号或者使用微信登录
        </p>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button icon="el-icon-share"
                   style="position: absolute; right: 0;"
                   circle @click="openMsgBox"/>
      </el-col>
    </el-row>
    <el-dialog title="打开微信扫一扫" :visible.sync="dialogCodeVisible">
      <img src="../assets/logo.png" style="width: 320px; height: 320px;"/>
    </el-dialog>
  </div>
</template>

<script>
import { AppInit } from '../utils/MenuHelper.js'

/* 账号别名映射 */
const AccountMapper = {
  develop: '12345678900', // 开发者账号
  admin: '12345678900', // 管理员账号
  administrator: '12345678900' // 管理员账号
}

export default {
  name: 'Login',
  data () {
    return {
      apis: this.$route.meta.apis,
      username: 'admin',
      password: '38180678',
      dialogCodeVisible: false
    }
  },
  mounted () {
    if (this.$store.getters.isLogin) {
      setTimeout(() => {
        this.$router.replace({ path: '/home' })
      }, 200)
    }
  },
  methods: {
    doLogin: function () {
      let user = this.$data.username
      let pass = this.$data.password

      if (user.length <= 0) {
        this.$notify({ type: 'warning', title: '错误提示', message: '电话号码需要填写,且长度为11位' })
        return
      }
      if (pass.length < 6 || pass.length > 12) {
        this.$notify({ type: 'warning', title: '错误提示', message: '密码需要填写,且长度为6-12位' })
        return
      }
      if (AccountMapper[user.toLowerCase()] !== undefined) {
        user = AccountMapper[user.toLowerCase()] // 超级管理员快捷登录别名
      }

      // 第一个加载框
      let load = this.$loading({ fullscreen: false, text: '正在登陆...', background: '#33333399' })
      this.apis.lad({
        username: user, password: pass
      }).then(res => {
        let { code, msg, data } = res
        if (code === 0) {
          load.close()
          let { roleList } = data
          if (roleList === undefined || roleList.length <= 0) {
            this.$message('账号没有控制台登录的权限,请联系你管理员处理')
          } else {
            this.goToHome(data)
          }
        } else {
          this.$message.error(msg)
        }
      }).catch(error => {
        this.$message.error(error.message)
      }).finally(f => {
        load.close()
      })
    },
    goToHome: function (loginData) {
      // 第二个加载框
      let load = this.$loading({ fullscreen: false, background: '#33333366' })
      // 保存登录信息
      this.$store.commit('saveLoginUser', loginData)

      // 应用程序初始化 async await
      AppInit().finally(i => {
        setTimeout(() => {
          this.$router.replace({ path: '/home' }) // 需要延迟,等待初始化路由等操作
          window.location.reload() // 为了避免数据加载不完整,进入到主页后再强制刷新一次
          load.close()
        }, 1000)
      })
    },
    openMsgBox () {
      this.$data.dialogCodeVisible = !this.$data.dialogCodeVisible
    }
  }
}
</script>

<style lang="scss" scoped>
  .row-style {
    width: 320px;
    margin: 0 auto;

    div {
      input {

      }
    }
  }
</style>
