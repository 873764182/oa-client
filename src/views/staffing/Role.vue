<template>
  <div class="root" style="background-color: #EFF1F4; width: 100%;">
    <div style="text-align: left; padding: 16px 20px 4px 20px;" v-permission="apis.rri">
      <el-button type="primary" icon="el-icon-plus" size="small" @click.native="handlerAdd">添加</el-button>
    </div>
    <div style="margin: 4px auto; width: 99%; text-align: left;">
      <div class="role-item" v-for="(role, index) in roleList" :key="index">
        <div style="text-align: left; margin: 8px 16px;">
          <label style="font-size: 16px;" :title="role.uid">{{role.name}}</label>
          <br>
          <span style="font-size: 14px; color: #999999" :title="role.time">{{role.depict}}</span>
        </div>
        <div v-show="role.uid !== $route.meta.specialKey">
          <div style="width: 100%; height: 1px; background-color: #EFF1F4; margin: 0 auto;">&nbsp;</div>
          <el-row style="width: 100%; height: 40px; text-align: center;">
            <el-col :span="11" class="role-item-btn" @click.native="handlerEdit(role)">
              <span style="line-height: 40px; font-size: 14px;">更多信息</span>
            </el-col>
            <el-col :span="2" style="margin: 0; padding: 0;">
              <div style="width: 1px; height: 40px; background-color: #EFF1F4;">&nbsp;</div>
            </el-col>
            <el-col :span="11" class="role-item-btn" @click.native="handlerDelete(role)" v-permission="apis.rrd">
              <span style="line-height: 40px; font-size: 14px;">删除</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <el-dialog
      title="添加角色"
      :before-close="onBeforeClose"
      :center="true"
      :visible.sync="addModelView"
      width="400px"
      v-loading.lock="loadViewVisible">
      <div style="height: 350px;">
        <el-form label-position="top" label-width="80px">
          <el-form-item label="角色名称">
            <el-input
              v-model="currentRole.name"
              autofocus="true"
              placeholder="请输入名称"
              maxlength="10"
              show-word-limit
              clearable/>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input
              v-model="currentRole.depict"
              type="textarea"
              rows="3"
              placeholder="请输入名称"
              maxlength="50"
              show-word-limit
              clearable/>
          </el-form-item>
          <el-form-item>
            <div style="margin: 16px 0; text-align: center;">
              <el-button type="primary" style="width: 100%; margin: 0 auto;" @click.native="saveAdd">确定</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      :before-close="onBeforeClose"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :center="true"
      width="600px"
      :visible.sync="editModelView"
      v-loading.lock="loadViewVisible">

      <el-tabs style="height: 500px;" v-model="currentTab" @tab-click="onTabClick">
        <el-tab-pane name="info">
          <span slot="label"><i class="el-icon-edit-outline"></i>&nbsp;基本信息</span>
          <div>
            <el-form label-position="top" label-width="80px">
              <el-form-item label="角色名称">
                <el-input
                  v-model="currentRole.name"
                  autofocus="true"
                  placeholder="请输入名称"
                  maxlength="10"
                  show-word-limit
                  clearable/>
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input
                  v-model="currentRole.depict"
                  type="textarea"
                  rows="3"
                  placeholder="请输入名称"
                  maxlength="50"
                  show-word-limit
                  clearable/>
              </el-form-item>
              <el-form-item>
                <div style="margin: 32px 0; text-align: center;" v-permission="apis.rru">
                  <el-button type="primary" style="width: 100%; margin: 0 auto;" @click="saveEdit">保存</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane name="permission">
          <span slot="label"><i class="el-icon-connection"></i>&nbsp;权限配置</span>
          <div style="position: relative; height: 450px">
            <div>
              <div v-for="(role, index) in rolePerList" :key="index" class="role-per-item">
                <el-checkbox v-model="role.select">{{role.name}}</el-checkbox>
                <div style="margin: 0 24px; padding-bottom: 8px; font-size: 12px; color: #999999;">{{role.depict}}</div>
                <div v-show="index !== rolePerList.length - 1"
                     style="width: 95%; height: 1px; margin: 0 auto; background-color: #EFF1F4;">&nbsp;
                </div>
              </div>
            </div>
            <div style="position: absolute; bottom: 0; right: 0;" v-permission="apis.rpu">
              <el-button size="small" type="primary" icon="el-icon-check" @click="savePer">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="user">
          <span slot="label"><i class="el-icon-user"></i>&nbsp;用户列表</span>
          <div style="position: relative; height: 450px">
            <div v-permission="apis.rus">
              <div v-for="(user, index) in roleUserList" :key="index" class="role-user-item">
                <div style="display: inline-block; width: 40px; height: 40px;">
                  <img src="/favicon.ico" style="width: 32px; height: 32px; margin: 4px;"/>
                </div>
                <div style="display: inline-block; width: auto; height: 40px;">
                  <section style="float: left; margin-top: 4px; margin-left: 4px;">
                    <label>{{user.username}}</label>
                    <span style="font-size: 12px; display: block;">{{user.phone}}</span>
                  </section>
                </div>
                <div
                  style="display: inline-block; width: auto; height: 40px; line-height: 40px; font-size: 20px; float: right;">
                  <i class="el-icon-close" style="padding: 2px;" v-permission="apis.rud" @click="deleteRoleUser(user)"></i>
                </div>

                <div style="width: 100%; height: 1px; background-color: #EFF1F4;"
                     v-show="index !== roleUserList.length - 1">&nbsp;
                </div>
              </div>
            </div>
            <div style="position: absolute; bottom: 0; right: 0;" v-permission="apis.rui">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="addUserView = true">添加</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        top="25vh"
        width="30%"
        title="输入用户电话号码"
        :visible.sync="addUserView"
        append-to-body>
        <el-form>
          <p v-html="titleAddUserBtn">&nbsp;</p>
          <el-form-item label="">
            <el-input
              prefix-icon="el-icon-phone"
              v-model="valueAddUserBtn"
              placeholder="请输入电话" size="medium"
              maxlength="11"
              show-word-limit
              autocomplete="off"
              clearable/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-permission="apis.rui">
          <el-button
            type="primary" size="small"
            :loading="loadAddUserBtn" :disabled="disabledAddUserBtn"
            @click="addRoleUser">确定
          </el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data () {
    return {
      apis: this.$route.meta.apis,
      roleList: [],
      addModelView: false,
      editModelView: false,
      addUserView: false,
      loadViewVisible: false,
      titleAddUserBtn: '输入电话号码',
      valueAddUserBtn: '',
      userIdAddUser: '',
      loadAddUserBtn: false,
      disabledAddUserBtn: true,
      currentTab: 'info',
      currentRole: {
        'name': '',
        'depict': '',
        'uid': '',
        'time': 0
      },
      rolePerList: [],
      roleUserList: []
    }
  },
  mounted () {
    this.doLoadData()
  },
  methods: {
    doLoadData: function () {
      this.$data.loadViewVisible = true
      this.$data.apis.rrs()
        .then(res => {
          let { code, msg, data } = res
          if (code === 0) {
            this.$data.roleList = data
          } else {
            this.$message(msg)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
        .finally(r => {
          this.$data.loadViewVisible = false
        })
    },
    handlerAdd: function () {
      // this.$data.currentRole = {}  // 重置实体数据
      this.$data.addModelView = true
    },
    handlerEdit: function (role) {
      this.$data.currentRole = role
      this.$data.editModelView = true
    },
    handlerDelete: function (role) {
      this.$confirm('确定删除？', '提示', {
        type: 'info',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$data.apis.rrd({ uid: role.uid })
          .then(res => {
            let { code, msg } = res
            if (code === 0) {
              this.doLoadData()
            } else {
              this.$message(msg)
            }
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      }).catch(error => {
        console.log(JSON.stringify(error))
      })
    },
    saveAdd: function () {
      if (this.$data.currentRole.name.length <= 0) {
        this.$message('角色名称不能为空')
        return
      }
      if (this.$data.currentRole.depict.length <= 0) {
        this.$message('角色描述不能为空')
        return
      }
      this.$data.apis.rri(this.$data.currentRole)
        .then(res => {
          let { code, msg, data } = res
          if (code === 0) {
            this.$data.currentRole = data
            this.doLoadData()
            this.$data.addModelView = false
          } else {
            this.$message(msg)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    saveEdit: function () {
      if (this.$data.currentRole.name.length <= 0) {
        this.$message('角色名称不能为空')
        return
      }
      if (this.$data.currentRole.depict.length <= 0) {
        this.$message('角色描述不能为空')
        return
      }
      this.$data.apis.rru(this.$data.currentRole)
        .then(res => {
          let { code, msg, data } = res
          if (code === 0) {
            this.$data.currentRole = data
            this.doLoadData()
            this.$data.editModelView = false
          } else {
            this.$message(msg)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    onBeforeClose: function (done) {
      this.doLoadData() // 对话框关闭时重新刷新数据
      this.$data.currentTab = 'info' // 重置为第一个选项卡,否则监听选项卡切换不能及时加载权限与用户信息
      done()
    },
    onTabClick: function (tab) {
      if (tab.name === 'permission') {
        this.doLoadPerList()
      } else if (tab.name === 'user') {
        this.doLoadUserList()
      } else {
        // console.log(tab.name)
      }
    },
    /**
       * 加载角色权限列表,同时比对是否拥有
       */
    doLoadPerList: function () {
      // this.$data.loadViewVisible = true
      this.$data.rolePerList = [] // 先清空缓存
      this.$data.apis.pps()
        .then(appRes => {
          if (appRes.code === 0) {
            this.$data.apis.rps({ roleId: this.$data.currentRole.uid })
              .then(roleRes => {
                let appPer = appRes.data
                let rolePer = roleRes.data
                if (!Array.isArray(appPer) || !Array.isArray(rolePer)) {
                  this.$message.error('权限信息异常')
                }
                let perList = []
                appPer.forEach(p => {
                  p.select = (rolePer.findIndex(r => r.perId === p.uid) !== -1)
                  perList.push(p)
                })
                this.$data.rolePerList = perList
              })
              .catch(e => {
                this.$message.error(e.message)
              })
              .finally(f => {
                // this.$data.loadViewVisible = false
              })
          }
        })
        .catch(error => {
          // this.$data.loadViewVisible = false
          this.$message.error(error.message)
        })
    },
    savePer: function () {
      this.$data.loadViewVisible = true
      let roleId = this.$data.currentRole.uid
      let perIds = ''
      if (this.$data.rolePerList.length > 0) {
        this.$data.rolePerList.forEach(p => {
          if (p.select) {
            perIds = perIds + p.uid
            perIds = perIds + '&'
          }
        })
        if (perIds.substring(perIds.length - 1, perIds.length) === '&') {
          perIds = perIds.substring(0, perIds.length - 1)
        }
      }
      this.$data.apis.rpu({
        roleId: roleId,
        perIds: perIds
      }).then(res => {
        this.$message(res.msg)
      }).catch(error => {
        this.$message.error(error.message)
      }).finally(f => {
        this.$data.loadViewVisible = false
      })
    },
    doLoadUserList: function () {
      this.$data.apis.rus({
        roleId: this.$data.currentRole.uid
      }).then(res => {
        let { code, msg, data } = res
        if (code === 0) {
          this.$data.roleUserList = data
        } else {
          this.$message(msg)
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    deleteRoleUser: function (user) {
      this.$data.apis.rud({ uid: user.uid })
        .then(res => {
          if (res.code === 0) {
            this.doLoadUserList()
          }
          this.$message(res.msg)
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    addRoleUser: function () {
      this.$data.apis.rui({
        userId: this.$data.userIdAddUser,
        roleId: this.$data.currentRole.uid
      }).then(res => {
        let { code, msg } = res
        if (code === 0) {
          this.doLoadUserList()
          this.$data.addUserView = false
          this.$data.valueAddUserBtn = ''
        }
        this.$message(msg)
      }).catch(error => {
        this.$message.error(error.message)
      })
    }
  },
  watch: {
    valueAddUserBtn: function (n, o) {
      if (n.length === 11) {
        this.$data.loadAddUserBtn = true
        this.$data.apis.ris({ phone: n }).then(res => {
          let { code, msg, data } = res
          if (code === 0) {
            this.$data.userIdAddUser = data.uid
            this.$data.titleAddUserBtn = data.username
            this.$data.disabledAddUserBtn = false
          } else {
            this.$data.titleAddUserBtn = '<span style=\'color: red\'>' + msg + '</span>'
          }
        }).catch(error => {
          this.$data.titleAddUserBtn = '<span style=\'color: red\'>' + error.message + '</span>'
        }).finally(f => {
          this.$data.loadAddUserBtn = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .role-item {
    display: inline-block;
    float: left;
    width: 240px;
    background-color: #ffffff;
    border-radius: 2px;
    margin: 8px;
    box-shadow: #EFF1F4 5px 5px 10px;
    border-style: solid;
    border-color: #eeeeee;
    border-width: 2px;

    &:hover {
      box-shadow: #999999 5px 10px 20px;
      border-color: #ffffff;
    }
  }

  .role-item-btn {
    cursor: pointer;

    &:hover {
      color: #409EFF;
    }
  }

  .role-per-item {
    padding: 8px 16px 0 16px;

    &:hover {
      background-color: #EFF1F4;
      border-radius: 2px;
    }
  }

  .role-user-item {
    padding: 4px 16px 0 16px;

    &:hover {
      background-color: #EFF1F4;
      border-radius: 0;
    }

    div {
      i {
        &:hover {
          background-color: #ffffff;
          border-radius: 20px;
          color: #F56C6C;
        }
      }
    }
  }
</style>
