<template>
  <div class="root">
    <div class="table-view">
      <div style="height: 10px">&nbsp;</div>
      <div style="position: relative; width: 100%;">
        <div style=" float: right; width: 360px; padding: 0 16px 8px 16px; text-align: right;">
          <el-input
            v-permission="[apis.ucs, apis.uus]"
            v-model="requestParams.search" size="small"
            prefix-icon="el-input__icon el-icon-search"
            placeholder="关键字搜索"
            style="width: 240px; margin-right: 16px;"
            @keyup.enter.native="doSearchUsers"
            clearable/>
          <el-button
            v-permission="apis.uui"
            type="primary" size="mini"
            icon="el-icon-plus"
            @click="handleNew">新增
          </el-button>
        </div>
      </div>
      <el-table
        v-permission="[apis.ucs, apis.uus]"
        style="width: 98%; margin: 0 auto; border-radius: 4px;"
        @row-click="tableRowClick"
        v-loading.lock="loadViewVisible"
        ref="tableListRef" :data="tableListData">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="user-info-detail">
              <section>
                <label>用户UID</label>
                <span>{{ props.row.uid }}</span>
              </section>
              <section>
                <label>用户名称</label>
                <span>{{ props.row.username }}</span>
              </section>
              <section>
                <label>电话</label>
                <span>{{ props.row.phone }}</span>
              </section>
              <section>
                <label>邮箱</label>
                <span>{{ props.row.email | nullDataHandler('未填写') }}</span>
              </section>
              <section>
                <label>登录密码</label>
                <span>{{ props.row.password }}</span>
              </section>
              <section>
                <label>性别</label>
                <span>{{ props.row | filtersUserGender }}</span>
              </section>
              <section>
                <label>注册时间</label>
                <span>{{ props.row.time | longTimeFormat }}</span>
              </section>
            </div>
            <div class="user-info-detail">
              <section>
                <label style="float: left; margin-top: 12px;">头像</label>
                <span>
                  <el-image :src="props.row.photo" style="width: 50px; height: 50px;">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" style="font-size: 50px;"></i>
                    </div>
                  </el-image>
                </span>
              </section>
              <section>
                <label>微信OID</label>
                <span>{{ props.row.wxOid | nullDataHandler('未绑定') }}</span>
              </section>
              <section>
                <label>部门</label>
                <span>{{ props.row | filtersUserDep }}</span>
              </section>
              <section>
                <label>地区</label>
                <span>{{ props.row | filtersUserRegion(true) }}</span>
              </section>
              <section>
                <label>角色</label>
                <span :title="props.row | filtersUserRoles(false)">{{ props.row | filtersUserRoles(true) }}</span>
              </section>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"/>
        <el-table-column label="注册时间" prop="time">
          <template slot-scope="scope">{{ scope.row.time | longTimeFormat }}</template>
        </el-table-column>
        <el-table-column label="名称" prop="username"/>
        <el-table-column label="电话号码" prop="phone"/>
        <el-table-column label="地区">
          <template slot-scope="scope">
            <span :title="scope.row.regionFullName">{{ scope.row | filtersUserRegion(false) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">{{ scope.row | filtersUserDep }}</template>
        </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button
              v-permission="apis.uuu"
              size="mini" icon="el-icon-edit"
              v-show="scope.row.uid !== specialKey"
              @click.stop="handleEdit(scope.$index, scope.row)"/>
            <el-button
              v-permission="apis.uud"
              size="mini" icon="el-icon-delete" type="danger"
              v-show="scope.row.uid !== specialKey"
              @click.stop="handleDelete(scope.$index, scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 5px" v-permission="[apis.ucs, apis.uus]">&nbsp;</div>
      <el-pagination
        v-permission="[apis.ucs, apis.uus]"
        style="margin: 0 24px;"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 50, 100, 150, 200, 500, 1000]"
        :page-size.sync="requestParams.limit"
        :current-page.sync="requestParams.viewPage"
        :total="tableTotal">
      </el-pagination>
      <div style="height: 5px">&nbsp;</div>
    </div>

    <el-dialog
      :visible.sync="editModelView"
      v-loading.lock="loadViewVisible">
      <div class="user-info-edit">
        <section>
          <label>用户名称</label>
          <el-input
            style="width: 320px;"
            placeholder="请输入名称"
            v-model="editModelUser.username"
            maxlength="10"
            show-word-limit
            clearable/>
        </section>
        <section>
          <label>电话（账号）</label>
          <el-input
            style="width: 320px;"
            placeholder="请输入电话"
            v-model="editModelUser.phone"
            maxlength="11"
            show-word-limit
            clearable/>
        </section>
        <section>
          <label>邮箱</label>
          <el-input
            style="width: 320px;"
            placeholder="请输入邮箱"
            v-model="editModelUser.email"
            maxlength="30"
            show-word-limit
            clearable/>
        </section>
        <section>
          <label>登录密码</label>
          <el-input
            style="width: 320px;"
            placeholder="请输入密码"
            v-model="editModelUser.password"
            maxlength="12"
            show-word-limit
            clearable/>
        </section>
        <section>
          <label>性别</label>
          <el-select
            style="width: 320px;"
            v-model="editModelUser.gender"
            placeholder="请选择">
            <el-option label="不填" :value="0"/>
            <el-option label="男生" :value="1"/>
            <el-option label="女生" :value="2"/>
          </el-select>
        </section>
        <section>
          <label>居住地区</label>
          <el-cascader
            style="width: 320px;"
            :props="regionProps"
            v-model="editModelUser.regionTemp"
            :show-all-levels="false"
            :placeholder="editModelUser.regionName"
            :title="editModelUser.regionFullName"
            clearable/>
        </section>
      </div>
      <section slot="footer">
        <!--v-permission="[apis.uuu, apis.uui, apis.rrs]"-->
        <el-button
          v-permission="apis.rrs"
          type="primary" icon="el-icon-check"
          circle @click="doEditSave"/>
      </section>
    </el-dialog>

  </div>
</template>

<script>

const mEditModelUser = {
  'gender': 0,
  'regionName': '',
  'regionFullName': '',
  'photo': '',
  'wxOid': '',
  'depName': '',
  'uid': '',
  'password': '',
  'phone': '',
  'regionId': '',
  'regionTemp': [],
  'depId': '',
  'time': 0,
  'email': '',
  'username': ''
}

const mRequestParams = {
  search: '',
  st: 0,
  et: new Date().getTime(),
  viewPage: 1, // 控件要求从1开始下标
  page: 0, // 后端接口页数从0开始
  limit: 10
}

export default {
  name: 'User',
  data () {
    return {
      apis: this.$route.meta.apis,
      specialKey: this.$route.meta.specialKey, // 特殊ID,代表最高基础权限,从路由数据区注入
      editModelView: false,
      editModelUser: mEditModelUser,
      tableListData: [],
      tableTotal: 1000,
      loadViewVisible: false,
      requestParams: mRequestParams
    }
  },
  mounted () {
    console.log('mounted ' + this.$vnode.name)
    this.doLoadUserCount()
    this.doLoadUserList()
  },
  activated () {
    console.log('activated')
  },
  methods: {
    /**
       * 获取用户总数
       */
    doLoadUserCount: function () {
      this.apis.ucs({})
        .then(res => {
          if (res.code === 0) {
            this.$data.tableTotal = res.data
          } else {
            this.$message(res.msg)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /**
       * 加载用户数据
       */
    doLoadUserList: function () {
      if (this.$data.requestParams.viewPage > 0) { // 将控件的下标赋值给接口需要的页数
        this.$data.requestParams.page = this.$data.requestParams.viewPage - 1
      } else {
        this.$data.requestParams.page = 0
      }
      this.$data.loadViewVisible = true
      this.apis.uus(this.$data.requestParams)
        .then(res => {
          if (res.code === 0) {
            this.$data.tableListData = res.data
          } else {
            this.$message(res.msg)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
        .finally(r => {
          this.$data.loadViewVisible = false
        })
    },
    /**
       * 搜索框回车事件 执行搜索数据
       */
    doSearchUsers: function () {
      this.doLoadUserList() // 直接调用加载数据即可,数据已经同步到参数体
    },
    /**
       * 表格行点击事件
       */
    tableRowClick: function (row, column, event) {
      this.$refs.tableListRef.toggleRowExpansion(row)
    },
    /**
       * 新增用户
       */
    handleNew: function () {
      this.$data.editModelView = true
      this.$data.editModelUser = mEditModelUser
    },
    /**
       * 编辑用户
       */
    handleEdit: function (index, row) {
      this.$data.editModelView = true
      this.$data.editModelUser = row
    },
    /**
       * 删除用户
       */
    handleDelete: function (index, row) {
      let then = () => {
        this.$data.loadViewVisible = true
        let t = res => {
          if (res.code === 0) {
            this.doLoadUserList() // 刷新列表
          }
          this.$message(res.msg)
        }
        let c = error => {
          this.$message.error(error.message)
        }
        let f = r => {
          this.$data.loadViewVisible = false
        }
        this.apis.uud({ uid: row.uid }).then(t).catch(c).finally(f)
      }
      this.$confirm('确定删除？', '提示', {
        type: 'info',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(then).catch(error => {
        console.log(JSON.stringify(error))
      })
    },
    /**
       * 新增与编辑用户信息保存
       */
    doEditSave: function () {
      if (this.$data.editModelUser.phone.length !== 11) {
        this.$message.error('请输入正确的11位电话号码')
        return
      }
      if (this.$data.editModelUser.email.length > 0) {
        if (!this.$data.editModelUser.email.includes('@') || !this.$data.editModelUser.email.includes('.')) {
          this.$message.error('请输入正确的邮箱地址')
          return
        }
      }
      if (this.$data.editModelUser.password.length < 6 || this.$data.editModelUser.password.length > 12) {
        this.$message.error('密码长度应该为6-12位长度')
        return
      }

      this.$data.loadViewVisible = true

      let t = res => {
        if (res.code === 0) {
          this.doLoadUserList() // 刷新列表
          this.$data.editModelView = false
        }
        this.$message(res.msg)
      }
      let c = error => {
        this.$data.editModelView = false
        this.$message.error(error.message)
      }
      let f = r => {
        this.$data.loadViewVisible = false
      }
      let regionTemp = this.$data.editModelUser.regionTemp
      if (regionTemp !== undefined && regionTemp.length > 0) {
        this.$data.editModelUser.regionId = regionTemp[regionTemp.length - 1] // 控件返回的数据是数组对象
      }
      if (this.$data.editModelUser.uid.length <= 0) {
        // 新增
        this.apis.uui(this.$data.editModelUser).then(t).catch(c).finally(f)
      } else {
        // 修改
        this.apis.uuu(this.$data.editModelUser).then(t).catch(c).finally(f)
      }
    },
    /**
       * 分页标签每页大小改变时
       */
    handleSizeChange: function (size) {
      this.$nextTick(() => {
        if (this.$data.requestParams.viewPage === 1) {
          // this.doLoadUserList()  // 控件会自动加载一次数据, 不用主动加载
        } else {
          this.$data.requestParams.viewPage = 1 // 页面变更会触发 handleCurrentChange 函数加载数据
        }
      })
    },
    /**
       * 当前页面下标改变时
       */
    handleCurrentChange: function (current) {
      this.$nextTick(() => {
        this.doLoadUserList()
      })
    }
  },
  computed: {
    regionProps: function () { // 动态加载地区信息
      return {
        lazy: true,
        lazyLoad: (node, resolve) => {
          let pid = '100000'
          const { level, value } = node
          if (level > 0) {
            pid = value
          }
          let nodeList = []
          this.$data.apis.rrs({ pid: pid }).then(res => {
            let { code, msg, data } = res
            if (code === 0 && data !== undefined && Array.isArray(data)) {
              data.forEach(item => {
                nodeList.push({
                  value: item.uid,
                  label: item.name,
                  leaf: level >= 2
                })
              })
            } else {
              this.$message.error(msg)
            }
          }).catch(error => {
            this.$message.error(error.message)
          }).finally(r => {
            resolve(nodeList)
          })
        }
      }
    }
  },
  filters: {
    filtersUserDep: function (user) {
      if (user.depId.length <= 0) {
        return '无'
      } else {
        return user.depName // user.depId
      }
    },
    filtersUserGender: function (user) {
      let gender = parseInt(user.gender)
      if (gender === 0) {
        return '未填写'
      } else if (gender === 1) {
        return '男'
      } else if (gender === 2) {
        return '女'
      } else {
        return user.gender
      }
    },
    filtersUserRegion: function (user, fuss) {
      if (user.regionId.length <= 0) {
        return '无'
      } else {
        if (fuss) {
          return user.regionFullName
        } else {
          return user.regionName // user.regionId
        }
      }
    },
    filtersUserRoles: function (user, name) {
      if (user.roleList === undefined || user.roleList.length <= 0) {
        return '无'
      } else {
        if (name) {
          let fullName = []
          user.roleList.forEach(role => {
            fullName.push(role.name)
          })
          return fullName.toString()
        } else {
          let fullDepict = []
          user.roleList.forEach(role => {
            fullDepict.push(role.depict)
          })
          return fullDepict.toString()
        }
      }
    }
  },
  watch: {
    requestParams: {
      handler (newValue, oldValue) {
        if (newValue.search.length <= 0) {
          this.doLoadUserList() // 直接调用加载数据即可,数据已经同步到参数体
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-view {
    position: absolute;
    width: 100%;
    text-align: left;
    background-color: #EFF1F4;
  }

  .user-info-detail {
    margin: -15px 32px 0 32px;
    width: 40%;
    float: left;

    section {
      margin: 8px 0;
      font-size: 14px;
      white-space: nowrap;

      label {
        display: inline-block;
        width: 120px;
        color: #888888;
      }

      span {
        color: #444444;
      }
    }
  }

  .user-info-edit {
    section {
      margin: 8px 0;
      font-size: 14px;
      white-space: nowrap;

      label {
        display: inline-block;
        width: 80px;
        color: #888888;
        margin-right: 16px;
        text-align: right;
      }

      span {
        color: #444444;
        text-align: left;
      }
    }
  }
</style>
