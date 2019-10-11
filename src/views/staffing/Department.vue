<template>
  <div class="root">
    <el-row type="flex" justify="space-around" style="margin: 0; padding: 16px 0;">
      <el-col :span="8">
        <div class="dep-view">
          <el-tree
            v-permission="apis.dds"
            @node-click="doNodeClick"
            v-loading.lock="depLoadViewVisible"
            :data="treeData"
            node-key="uid"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false">
            <section class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="userIsDepAdmin">
              <i class="el-icon-plus"
                 v-permission="apis.ddi"
                 style="background-color: #67C23A"
                 :title="'为['+data.name+']添加子部门'"
                 @click.stop="addDep(node, data)"></i>

              <i class="el-icon-edit"
                 v-permission="apis.ddu"
                 style="background-color: #409EFF"
                 :title="'修改['+data.name+']的基本信息'"
                 @click.stop="editDep(node, data)"
                 v-show="rootDepNodeUid !== data.uid"></i>

              <i class="el-icon-close"
                 v-permission="apis.ddd"
                 style="background-color: #F56C6C"
                 :title="'删除['+data.name+']'"
                 @click.stop="delDep(node, data)"
                 v-show="rootDepNodeUid !== data.uid"></i>
            </span>
            </section>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="user-view" v-loading.lock="userLoadViewVisible" v-permission="apis.dus">
          <section v-show="depUserList.length > 0" class="user-list" v-for="(user, index) in depUserList" :key="index">
            <div style="display: inline-block; width: 40px; height: 40px;">
              <img :src="user.photo" style="width: 30px; height: 30px; margin: 5px; border-radius: 4px;"/>
            </div>
            <div style="display: inline-block; position: absolute; width: auto; height: 40px; margin: 3px 0 0 3px;">
              <div style="font-size: 14px;">{{user.username}}
                <span style="font-size: 12px; color: #5A5E66; margin-left: 4px;" v-show="user.uid === loginUserId">[当前登录账号]</span>
              </div>
              <div style="font-size: 12px;">{{user.phone}}</div>
            </div>
            <section v-if="userIsDepAdmin">
              <i class="el-icon-check"
                 v-permission="apis.dad"
                 title="设部门管理员"
                 @click.stop="doSetAdmin(user)"
                 style="background-color: #409EFF;"
                 v-show="(loginUserId !== user.uid) && (rootDepNodeUid !== clickDep.uid)"></i>
              <i class="el-icon-close"
                 v-permission="apis.dud"
                 title="从部门中删除"
                 @click.stop="doDelUser(user)"
                 style="background-color: #F56C6C;"
                 v-show="loginUserId !== user.uid"></i>
            </section>
            <div style="width: 95%; height: 1px; margin: 0 auto; background-color: #F0F7FF;"
                 v-show="index < (depUserList.length - 1)">&nbsp;
            </div>
          </section>
          <section v-show="userIsDepAdmin && depUserList.length <= 0" style="text-align: center;">
            <p style="color: #5A5E66; font-size: 12px;">请点击右边部门查看部门用户列表</p>
            <p style="color: #5A5E66; font-size: 12px;">如需为部门添加用户请点击右上角蓝色按钮</p>
          </section>
        </div>
      </el-col>
      <el-col :span="6" style="text-align: left;">
        <el-button
          icon="el-icon-plus"
          type="primary" size="medium"
          @click.native="doAddUser"
          v-if="userIsDepAdmin"
          v-permission="apis.dui">
          添加用户
        </el-button>
        <section style="font-size: 14px;">
          <p>部门名称：<strong>{{clickDep.name}}</strong></p>
          <p>部门代码：<strong>{{clickDep.code}}</strong></p>
          <p>所在地区：<strong>{{clickDep.regionInfo.fullName}}</strong></p>
          <p>部门管理员：<span style="color: #409EFF;">{{clickDep.adminUser.name}}</span></p>
        </section>
      </el-col>
    </el-row>

    <el-dialog
      title="部门"
      width="30%"
      :visible.sync="depDialogVisible"
      :close-on-click-modal="false">
      <el-form>
        <el-form-item label="部门名称">
          <el-input
            v-model="editDepData.name"
            placeholder="填写部门名称"
            maxlength="20"
            show-word-limit
            autocomplete="off"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="部门代码">
          <el-input
            v-model="editDepData.code"
            type="number"
            placeholder="填写部门代码"
            maxlength="10"
            show-word-limit
            autocomplete="off"
            clearable>
            <!--<template slot="prepend">{{editDepData.superCode}}</template>-->
          </el-input>
        </el-form-item>
        <el-form-item label="部门所在城市地区">
          <el-cascader
            :show-all-levels="false"
            :placeholder="editDepData.regionInfo.name"
            :title="editDepData.regionInfo.fullName"
            v-model="editDepData.regionInfo.regionIdList"
            style="width: 100%;"
            :props="regionProps"
            clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="saveDep">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      top="25vh"
      width="30%"
      title="输入用户电话号码"
      :visible.sync="addUserView"
      append-to-body>
      <el-form>
        <el-form-item label="电话号码">
          <el-input
            prefix-icon="el-icon-phone"
            v-model="valueAddUserPhone"
            placeholder="请输入电话"
            maxlength="11"
            show-word-limit
            autocomplete="off"
            clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="loadAddUserBtn"
          @click="doAddUserSave">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Department',
  data () {
    return {
      apis: this.$route.meta.apis,
      depLoadViewVisible: false,
      depDialogVisible: false,
      userLoadViewVisible: false,
      addUserView: false,
      loadAddUserBtn: false,
      valueAddUserPhone: '',
      rootDepNodeUid: this.$store.getters.userInfo.department.uid,
      loginUserId: this.$store.getters.userInfo.userId,
      userIsDepAdmin: false,
      listData: [],
      treeData: [],
      editDepData: this.getEmptyData(),
      depEditModel: false,
      clickDep: {
        regionInfo: {},
        adminUser: {}
      },
      depUserList: []
    }
  },
  mounted () {
    this.doLoadList()
  },
  methods: {
    /**
       * 加载部门数据
       */
    doLoadList: function () {
      let rootDepNodeUid = this.$data.rootDepNodeUid
      if (rootDepNodeUid === undefined || rootDepNodeUid.length <= 0) {
        this.$message.error('您的部门信息错误,不能获取部门数据')
        return
      }
      this.$data.depLoadViewVisible = true
      this.$data.apis.dds({ root: rootDepNodeUid }).then(res => {
        let { code, msg, data } = res
        if (code === 0) {
          this.$data.listData = data // 保留一份原始数据,这是全部的部门信息数据
          this.$data.treeData = this.listToTree(data, rootDepNodeUid)
        } else {
          this.$message(msg)
        }
      }).catch(error => {
        this.$message.error(error.message)
      }).finally(f => {
        this.$data.depLoadViewVisible = false
      })
    },
    /**
       * 将列表数据转为数形数据 (指定自己所在的部门为根节点,往上的节点不能查看)
       */
    listToTree: function (list, rootId) {
      if (!Array.isArray(list) || list.length <= 0) {
        return []
      }
      let tempRootNode = list.filter(node => node.uid === rootId)
      if (tempRootNode == null || tempRootNode.length <= 0) {
        return []
      }

      let initChildrenNodes = (node) => {
        let childrenNode = list.filter(n => n.pid === node.uid)
        if (childrenNode != null && childrenNode.length > 0) {
          node.children = childrenNode
          childrenNode.forEach(c => {
            initChildrenNodes(c) // 递归
          })
        } else {
          node.children = []
        }
      }

      let rootNode = tempRootNode[0]
      try {
        this.$data.userIsDepAdmin = (this.$data.loginUserId === rootNode.adminUser.userId)
      } catch (e) {
        console.log('检查用户是否是部门管理员异常' + e.message)
      }
      initChildrenNodes(rootNode)
      return [rootNode]
    },
    // 获取一份空白数据作为编辑添加的模版
    getEmptyData: function () {
      return {
        'uid': '',
        'pid': '',
        'time': 0,
        'name': '',
        'code': '',
        'superCode': '',
        'adminUser': {
          'userId': '',
          'name': '',
          'phone': '',
          'email': '',
          'photo': '',
          'gender': 0
        },
        'regionInfo': {
          'regionId': '',
          'regionIdList': [],
          'name': '选择地区',
          'fullName': '',
          'englishName': ''
        }
      }
    },
    // 查找父级CODE范围
    findSuperCode: function (current, addIn) {
      let listData = this.$data.listData
      if (listData.length <= 0) {
        return ''
      }
      let code = ''
      if (addIn) {
        code = current.code // 添加模式需要包含当前节点
      }

      let initCode = (node) => {
        let pNode = listData.find(n => n.uid === node.pid)
        if (pNode !== undefined) {
          code = pNode.code + code
          if (pNode.pid !== '0' || pNode.pid.length > 0) {
            initCode(pNode) // 递归查找
          }
        }
      }

      initCode(current)
      return code
    },
    // 添加部门
    addDep: function (node, data) {
      this.$data.depDialogVisible = true
      this.$data.depEditModel = false
      this.$data.editDepData = this.getEmptyData()
      this.$data.editDepData.uid = data.uid
      // this.$data.editDepData.superCode = this.findSuperCode(data, true)
    },
    // 修改部门
    editDep: function (node, data) {
      // let superCode = this.findSuperCode(data, false)

      this.$data.depDialogVisible = true
      this.$data.depEditModel = true
      this.$data.editDepData = this.getEmptyData()
      this.$data.editDepData.uid = data.uid
      this.$data.editDepData.pid = data.pid
      this.$data.editDepData.time = data.time
      this.$data.editDepData.name = data.name
      this.$data.editDepData.code = data.code
      // this.$data.editDepData.code = data.code.replace(superCode, '')
      // this.$data.editDepData.superCode = superCode
      if (data.adminUser !== undefined) {
        this.$data.editDepData.adminUser.userId = data.adminUser.userId
        this.$data.editDepData.adminUser.name = data.adminUser.name
        this.$data.editDepData.adminUser.phone = data.adminUser.phone
        this.$data.editDepData.adminUser.email = data.adminUser.email
        this.$data.editDepData.adminUser.photo = data.adminUser.photo
        this.$data.editDepData.adminUser.gender = data.adminUser.gender
      }
      if (data.regionInfo !== undefined) {
        this.$data.editDepData.regionInfo.regionId = data.regionInfo.regionId
        this.$data.editDepData.regionInfo.regionIdList = [data.regionInfo.regionId]
        this.$data.editDepData.regionInfo.name = data.regionInfo.name
        this.$data.editDepData.regionInfo.fullName = data.regionInfo.fullName
        this.$data.editDepData.regionInfo.englishName = data.regionInfo.englishName
      }
    },
    // 保存添加修改
    saveDep: function () {
      let regionIdList = this.$data.editDepData.regionInfo.regionIdList
      let regionId = ''
      if (regionIdList.length > 0) {
        regionId = regionIdList[regionIdList.length - 1]
      }
      if (this.$data.depEditModel) {
        this.$data.apis.ddu({
          uid: this.$data.editDepData.uid,
          pid: this.$data.editDepData.pid,
          name: this.$data.editDepData.name,
          // code: this.$data.editDepData.superCode + this.$data.editDepData.code,
          code: this.$data.editDepData.code,
          adminUser: this.$data.editDepData.adminUser.userId,
          regionId: regionId
        }).then(res => {
          let { code, msg } = res
          if (code === 0) {
            this.doLoadList()
          }
          this.$message(msg)
        }).catch(error => {
          this.$message.error(error.message)
        })
      } else {
        this.$data.apis.ddi({
          pid: this.$data.editDepData.uid,
          name: this.$data.editDepData.name,
          // code: this.$data.editDepData.superCode + this.$data.editDepData.code,
          code: this.$data.editDepData.code,
          adminUser: '',
          regionId: regionId
        }).then(res => {
          let { code, msg } = res
          if (code === 0) {
            this.doLoadList()
          }
          this.$message(msg)
        }).catch(error => {
          this.$message.error(error.message)
        })
      }
      this.$data.depDialogVisible = false
    },
    // 删除部门
    delDep: function (node, data) {
      this.$confirm('删除部门会让部门里的用户将会变成无部门用户，确定删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$data.apis.ddd({ uid: data.uid }).then(res => {
          let { code, msg } = res
          if (code === 0) {
            this.doLoadList()
          }
          this.$message(msg)
        }).catch(error => {
          this.$message.error(error.message)
        })
      })
    },
    // 加载部门用户
    doLoadDepUser: function (depId) {
      this.$data.apis.dus({
        depId: depId
      }).then(res => {
        let { code, msg, data } = res
        if (code === 0) {
          this.$data.depUserList = data
        } else {
          this.$message(msg)
        }
      }).catch(error => {
        this.$message.error(error.message)
      }).finally(f => {
        this.$data.userLoadViewVisible = false
      })
    },
    // 树节点点击事件
    doNodeClick: function (data, node, el) {
      this.$data.userLoadViewVisible = true
      this.$data.clickDep = data
      this.doLoadDepUser(data.uid)
    },
    // 设置管理员
    doSetAdmin: function (user) {
      this.$data.apis.dad({
        depId: this.$data.clickDep.uid,
        userId: user.uid
      }).then(res => {
        let { code, msg } = res
        if (code === 0) {
          this.$nextTick(() => {
            this.$data.clickDep.adminUser.name = user.username // 修改管理员显示
          })
        }
        this.$message(msg)
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    // 删除部门用户
    doDelUser: function (user) {
      this.$data.apis.dud({
        depId: this.$data.clickDep.uid,
        userId: user.uid
      }).then(res => {
        let { code, msg } = res
        if (code === 0) {
          this.$nextTick(() => {
            this.$data.clickDep.adminUser.name = user.username // 修改管理员显示
            this.doLoadDepUser(this.$data.clickDep.uid)
          })
        }
        this.$message(msg)
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    // 新增部门用户
    doAddUser: function () {
      if (this.$data.clickDep.uid === undefined) {
        this.$message('请先从左边部门框中选中部门')
        return
      }
      this.$data.addUserView = true
    },
    // 保存添加
    doAddUserSave: function () {
      this.$data.loadAddUserBtn = true
      this.$data.apis.dui({
        depId: this.$data.clickDep.uid,
        phone: this.$data.valueAddUserPhone
      }).then(res => {
        let { code, msg } = res
        if (code === 0) {
          this.$data.addUserView = false
          this.doLoadDepUser(this.$data.clickDep.uid)
        }
        this.$message(msg)
      }).catch(error => {
        this.$message.error(error.message)
      }).finally(f => {
        this.$data.loadAddUserBtn = false
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
  }
}
</script>

<style lang="scss" scoped>
  .dep-view {
    width: 100%;
    border-style: solid;
    border-width: 4px;
    border-color: #F0F7FF;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    color: #333333;

    span {
      i {
        border-radius: 20px;
        padding: 4px;
        margin: 4px;
        visibility: hidden;
        color: #ffffff;

        &:hover {
          box-shadow: #5A5E66 1px 1px 1px;
        }
      }
    }

    &:hover {
      span {
        i {
          visibility: visible;
        }
      }
    }
  }

  .user-view {
    width: 100%;
    height: 100%;
    text-align: left;
    border-style: solid;
    border-width: 4px;
    border-color: #F0F7FF;
  }

  .user-list {
    width: 100%;
    height: 45px;

    section {
      display: inline-block;
      float: right;
      height: 40px;
      line-height: 40px;
      font-size: 18px;

      i {
        border-radius: 30px;
        margin: 8px;
        padding: 4px;
        color: #ffffff;
        visibility: hidden;

        &:hover {
          box-shadow: #5A5E66 1px 1px 1px;
        }
      }
    }

    &:hover {
      background-color: #F0F7FF;

      section {
        i {
          visibility: visible;
        }
      }
    }
  }
</style>
