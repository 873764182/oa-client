<template>
  <div class="root">
    <el-row type="flex" justify="space-between" class="el-row">
      <!--权限列表-->
      <el-col :span="5" style="position: relative;">
        <div class="row-content" v-permission="apis.pps">
          <!--权限列表-->
          <section class="per-item-layout">
            <div class="per-item"
                 v-for="(per, index) in perPerList"
                 :key="index"
                 :style="activeItemStyle(per)"
                 @click="doPerClick(per)">
              <label :style="activePerStyle(per)">{{per.name}}</label>
              <i class="el-icon-close" v-permission="apis.ppd"
                 @click="doDelete(per)"
                 v-show="per.uid !== specialKey"></i>
              <b class="el-icon-edit" v-permission="apis.ppu"
                 @click="doEdit(per)"
                 v-show="per.uid !== specialKey"></b>
              <br>
              <span>{{per.depict}}</span>
              <div v-if="index !== perPerList.length - 1">&nbsp;</div>
            </div>
          </section>
        </div>
        <!--编辑区域-->
        <transition name="el-fade-in-linear">
          <div style="position: absolute; width: 100%; height: 95%; top: 0;
               border-radius: 16px; background-color: #efefef; opacity: 0.9;"
               v-show="perEditView">
            <div style="margin: 50% 24px 0 24px;">
              <strong>{{perEditUid}}</strong>
            </div>
            <div style="margin: 16px 24px 0 24px;">
              <el-input
                placeholder="权限名称"
                v-model="perEditName"
                maxlength="10"
                show-word-limit
                clearable/>
            </div>
            <div style="margin: 16px 24px 0 24px;">
              <el-input
                placeholder="权限说明"
                v-model="perEditDepict"
                maxlength="20"
                show-word-limit
                :rows="4"
                type="textarea"
                clearable/>
            </div>
            <el-row style="height: auto; background-color: transparent;">
              <el-col :span="12">
                <el-button type="danger" icon="el-icon-close" circle title="取消" @click="doEditCancel"/>
              </el-col>
              <el-col :span="12" style="padding-left: 8px">
                <el-button type="success" icon="el-icon-check" circle title="保存" @click="doEditSave"></el-button>
              </el-col>
            </el-row>
          </div>
        </transition>
        <!--按钮区域-->
        <section style="position: absolute; bottom: 64px; right: 24px;" v-permission="apis.ppi"
                 v-show="!perEditView">
          <el-button type="primary" icon="el-icon-plus" circle
                     title="新增权限" @click="perEditView = true"/>
        </section>
      </el-col>

      <!--权限接口-->
      <el-col :span="7" style="position: relative;">
        <div class="row-content" v-loading.lock="loadViewVisible" v-permission="[apis.aps, apis.pas]">
          <section style="text-align: left;">
            <div v-for="(app, index) in appPermissionApis" :key="index">
              <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 8px 16px; ">
                <span style="color: #42b983; font-size: 14px;">{{app.name}}</span>
                <span style="margin-left: 8px; font-size: 12px; color: #cccccc;">{{app.rest}}</span>
              </div>
              <section v-for="(api, ind) in app.apiList" :key="ind" class="api-item" style="padding: 8px 20px 0 20px;">
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  <el-checkbox v-model="api.check" @change="onCheckboxChange">
                    <span>{{api.name}}</span>
                    <span style="margin-left: 8px; font-size: 12px; color: #cccccc;">{{api.apis}}</span>
                  </el-checkbox>
                </div>
                <el-tooltip :content="api.depict" placement="bottom" :open-delay="1000">
                  <div style="color: #cccccc; font-size: 12px;
                      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <span style="margin-left: 24px;">{{api.depict}}</span>
                  </div>
                </el-tooltip>
                <div style="height: 10px;">&nbsp;</div>
              </section>
            </div>
          </section>
        </div>
        <section style="position: absolute; bottom: 64px; right: 24px;">
          <el-button type="success" icon="el-icon-check" circle title="保存修改"
                     @click.native="savePerUpdate" v-permission="apis.pau"></el-button>
        </section>
      </el-col>

      <!--相关页面-->
      <el-col :span="8">
        <div class="row-content related-page" v-loading.lock="loadViewVisible">
          <div style="padding: 8px; color: #409EFF; font-size: 16px; cursor: pointer;">
            <el-tooltip content="灰色:不能访问, 黄色:部分访问, 绿色:全部访问" placement="top" :open-delay="1000">
              <span>受影响的页面</span>
            </el-tooltip>
          </div>
          <div style="width: 95%; height: 1px; background-color: #EFF1F4; margin: 4px auto;">&nbsp;</div>
          <section style="text-align: left;">
            <div v-for="(depend, index) in relatedDependView" :key="index" class="api-item">
              <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 8px 16px; ">
                <span :style="{color: availableViewNameColor(depend), fontSize: '14px'}">{{depend.name}}</span>
                <span style="margin-left: 8px; font-size: 12px; color: #cccccc;">{{depend.path}}</span>
              </div>
              <section v-for="(api, ind) in depend.apis" :key="ind" style="padding: 8px 30px 0 30px;">
                <div :style="availableViewApiStyle(api)">
                  {{(ind + 1)}}.&nbsp;{{api}}
                </div>
                <div style="height: 10px;">&nbsp;</div>
              </section>
            </div>
          </section>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { MenusWhitNoIndex } from '../../utils/MenuHelper.js'
import { GetRouterPageApi } from '../../utils/Permission.js'
import { ContainArray, ExistArray } from '../../utils/PublicFunction.js'

export default {
  name: 'Permission',
  data () {
    return {
      apis: this.$route.meta.apis, // 绑定路由meta数据到组件数据区,方便在当前组件使用
      specialKey: this.$route.meta.specialKey, // 特殊ID,代表最高基础权限,从路由数据区注入
      perPerList: [],
      perEditView: false,
      perEditUid: '',
      perEditName: '',
      perEditDepict: '',
      activePerUid: this.specialKey + '', // 避免引用牵连修改
      appPermissionApis: [],
      loadViewVisible: false,
      relatedDependView: []
    }
  },
  mounted: function () {
    this.doLoadAppPermission()
    this.doLoadPerData(this.$data.specialKey)
  },
  methods: {
    doLoadPerData (activeUid) { // 获取权限列表
      this.apis.pps({}).then(res => {
        if (res.code === 0) {
          this.$data.perPerList = res.data.sort((o, n) => {
            return o.time - n.time // 数组排序,从小到大
          })
        } else {
          this.$message(res.msg)
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.doPerClick({ uid: activeUid })
          }, 500)
        })
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    doLoadAppPermission () { // 获取系统需要认证的权限列表(其实可以通过权限模块的中缓存获取,但是哪里的数据被解析为列表了)
      this.apis.aps().then(res => {
        if (res.code === 0) {
          this.$data.appPermissionApis = [] // 清空数组
          res.data.forEach(app => {
            let apiList = app.apiList
            if (apiList !== undefined && Array.isArray(apiList)) {
              apiList.forEach(api => {
                api.check = false // 增加一个是否选中的属性
              })
            }
            this.$data.appPermissionApis.push(app)
          })
          this.$nextTick(() => {
            this.doInitDependView() // 初始化依赖界面的显示
          })
        } else {
          this.$message(res.msg)
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    doInitDependView () { // 初始化依赖的界面数据
      this.$data.relatedDependView = []
      let temp = MenusWhitNoIndex()
      temp.forEach(menu => {
        let type = menu.type
        if (type === 'group') {
          let items = menu.items
          items.forEach(item => {
            let apis = GetRouterPageApi(item, true)
            let name = '/' + menu.name + ' /' + item.name
            let path = item.path
            this.$data.relatedDependView.push({ name: name, apis: this.filterPermissionApi(apis), path: path })
          })
        } else {
          let apis = GetRouterPageApi(menu, true)
          let name = '/' + menu.name
          let path = menu.path
          this.$data.relatedDependView.push({ name: name, apis: this.filterPermissionApi(apis), path: path })
        }
      })
    },
    /* 过滤不是权限的API依赖 */
    filterPermissionApi (apis) {
      if (!Array.isArray(apis)) {
        return []
      }
      let temp = []
      apis.forEach(api => {
        if (this.appPermissionApiList.findIndex(a => a === api) !== -1) {
          temp.push(api)
        }
      })
      return temp
    },
    doDelete (per) {
      this.$confirm('删除将会让所有引用该权限的角色失去对应的权限', '系统警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.apis.ppd({ uid: per.uid }).then(res => {
          if (res.code === 0) {
            let index = this.$data.perPerList.findIndex(p => p.uid === per.uid)
            if (index > 0) {
              let target = this.$data.perPerList[index - 1]
              this.doLoadPerData(target.uid) // 删除完成后将上一个定为选中
            } else {
              this.doLoadPerData(this.$data.specialKey) // 默认选中第一个
            }
          } else {
            this.$message(res.msg)
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      })
    },
    doEdit (per) {
      this.$data.perEditUid = per.uid
      this.$data.perEditName = per.name
      this.$data.perEditDepict = per.depict
      this.$data.perEditView = true
    },
    doEditCancel () {
      this.$data.perEditUid = ''
      this.$data.perEditName = ''
      this.$data.perEditDepict = ''
      this.$data.perEditView = false
    },
    doEditSave () {
      let uid = this.$data.perEditUid
      let name = this.$data.perEditName
      let depict = this.$data.perEditDepict

      if (name.length <= 0) {
        this.$message('权限名称需要填写')
        return
      }
      if (depict.length <= 0) {
        this.$message('权限说明需要填写')
        return
      }

      if (uid.length <= 0) {
        this.apis.ppi({
          name: name,
          depict: depict
        }).then(res => {
          if (res.code === 0) {
            this.doLoadPerData(res.data.uid)
          } else {
            this.$message(res.msg)
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      } else {
        this.apis.ppu({
          uid: uid,
          name: name,
          depict: depict
        }).then(res => {
          if (res.code === 0) {
            this.doLoadPerData(res.data.uid)
          } else {
            this.$message(res.msg)
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      }

      this.doEditCancel() // 还原数据
    },
    doPerClick (per) {
      this.$data.activePerUid = per.uid
      this.$data.loadViewVisible = true
      let tempApa = this.$data.appPermissionApis // Object.assign(tempApa, this.$data.appPermissionApis) // 复制数组(浅复制)
      // this.$data.appPermissionApis = [] // 清空列表 避免显示加载框时界面还可以滚动 但是会造成界面抖动 应该从UI层去优化
      // 从后端接口获取当前权限拥有的API列表,且比对是否选中
      this.apis.pas({ perId: per.uid }).then(res => {
        if (res.code === 0) {
          let perApis = res.data
          tempApa.forEach(app => {
            let apiList = app.apiList
            if (apiList !== undefined && Array.isArray(apiList)) {
              apiList.forEach(api => {
                let index = perApis.findIndex(pa => pa.api === api.apis)
                api.check = index !== -1 // 判断是否选中
              })
            }
          })
          this.$data.appPermissionApis = tempApa
        } else {
          this.$message(res.msg)
        }
      }).catch(error => {
        this.$message.error(error.message)
      }).finally(f => {
        this.$data.loadViewVisible = false
      })
    },
    /* 保存API变更 */
    savePerUpdate () {
      let perId = this.$data.activePerUid
      if (perId === this.$data.specialKey) {
        this.$message('不能修改超级管理员的权限信息')
        return
      }
      let checkList = []
      this.$data.appPermissionApis.forEach(app => {
        let apiList = app.apiList
        if (apiList !== undefined && Array.isArray(apiList)) {
          apiList.forEach(api => {
            if (api.check) {
              checkList.push(api)
            }
          })
        }
      })

      let apiData = ''
      if (checkList.length > 0) {
        checkList.forEach(api => {
          let name = this.removeSpecialSymbols(api.name)
          let depict = this.removeSpecialSymbols(api.depict)
          let apis = this.removeSpecialSymbols(api.apis)

          apiData += (name + '|' + depict + '|' + apis + '&')
        })

        if (apiData.substring(apiData.length - 1, apiData.length) === '&') {
          apiData = apiData.substring(0, apiData.length - 1) // 删除末尾的'&'字符
        }
      } else {
        apiData = ''
      }

      this.apis.pau({
        perId: perId,
        apiData: apiData
      }).then(res => {
        if (res.code === 0) {
          this.doPerClick({ uid: perId })
        }
        this.$message(res.msg)
      }).then(error => {
        this.$message.error(error.message)
      })
    },
    removeSpecialSymbols (string) { // 去除后端接口要求的删除的字符与进行URL编码
      let temp = string
      do {
        temp = temp.replace('|', '').replace('&', '')
      } while (temp.indexOf('|') !== -1 || temp.indexOf('&') !== -1)
      return encodeURIComponent(temp)
    },
    onCheckboxChange (value) {
      // this.$data.appPermissionApis
    }
  },
  computed: {
    /* 权限item被点中活跃的样式 */
    activePerStyle: function () {
      return function (per) {
        if (per.uid === this.$data.activePerUid) {
          return { color: '#42b983', fontWeight: 'normal' }
        } else {
          return { color: '#5A5E66', fontWeight: 'normal' }
        }
      }
    },
    activeItemStyle: function () {
      return function (per) {
        if (per.uid === this.$data.activePerUid) {
          return { backgroundColor: '#EFF1F4' }
        } else {
          return {}
        }
      }
    },
    // 获取的API列表
    appPermissionApiList: function () {
      let tempList = []
      let apis = this.$data.appPermissionApis
      if (Array.isArray(apis)) {
        apis.forEach(rest => {
          let apiList = rest.apiList
          if (Array.isArray(apiList)) {
            apiList.forEach(api => {
              tempList.push(api.apis)
            })
          }
        })
      }
      return tempList
    },
    // 获取选中的API列表
    appPermissionCheckApiList: function () {
      let tempList = []
      let apis = this.$data.appPermissionApis
      if (Array.isArray(apis)) {
        apis.forEach(rest => {
          let apiList = rest.apiList
          if (Array.isArray(apiList)) {
            apiList.forEach(api => {
              if (api.check) {
                tempList.push(api.apis)
              }
            })
          }
        })
      }
      return tempList
    },
    availableViewNameColor: function () {
      return function (depend) {
        let checkApi = this.appPermissionCheckApiList // 选中的接口数
        let dependApis = depend.apis // 依赖的接口数

        if (ContainArray(checkApi, dependApis)) {
          return '#42b983'
        } else if (ExistArray(checkApi, dependApis)) {
          return '#E6A23C'
        } else {
          return '#AAAAAA'
        }
      }
    },
    availableViewApiStyle: function () {
      return function (api) {
        let style = {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '12px',
          padding: '0px',
          margin: '0px',
          lineHeight: '12px',
          color: '#AAAAAA'
        }
        let index = this.appPermissionCheckApiList.findIndex(a => a === api)
        if (index !== -1) {
          style.color = '#333333'
        }
        return style
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    padding: 24px 40px;
    width: 100%;
    height: 100%;
    background-color: #EFF1F4;
  }

  .row-content {
    position: relative;
    background-color: #ffffff;
    border-radius: 10px 10px 10px 10px;
    box-shadow: #cccccc 5px 5px 10px;
    width: auto;
    height: 95%;
    max-height: 95%;
    overflow-x: hidden;
    overflow-y: auto;

    /* 页面滚动,但是不现实滚动条,仅兼容chrome浏览器 https://www.cnblogs.com/lovling/p/8000363.html */
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .per-item-layout {
    position: absolute;
    width: 100%;
    padding: 8px 0;
  }

  .per-item {
    text-align: left;
    cursor: pointer;
    padding: 8px 0 0 0;

    &:hover {
      background-color: #EFF1F4;

      div {
        visibility: hidden;
      }

      i, b {
        color: #EFF1F4;
      }
    }

    &:active {
      background-color: #ffffff;

      i, b {
        color: #ffffff;
      }
    }

    label {
      color: #5A5E66;
      font-size: 14px;
      margin-left: 16px;
    }

    span {
      display: inline-block;
      color: #cccccc;
      font-size: 12px;
      padding-bottom: 8px;
      margin-left: 16px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    i {
      position: absolute;
      right: 0;
      font-size: 24px;
      line-height: 40px;
      padding: 0 8px;
      color: #ffffff;
      margin-right: 16px;

      &:hover {
        background-color: #ffffff;
        border-radius: 20px;
        color: #ED0019;
      }
    }

    b {
      position: absolute;
      right: 55px;
      font-size: 24px;
      line-height: 40px;
      padding: 0 8px;
      color: #ffffff;

      &:hover {
        background-color: #ffffff;
        border-radius: 20px;
        color: #42b983;
      }
    }

    div {
      width: 100%;
      height: 1px;
      background-color: #EFF1F4;
    }
  }

  .related-page {
    box-shadow: none;
    border-radius: 4px;
    border-style: solid;
    border-color: #409EFF;
    border-width: 1px;
  }

  .api-item {
    &:hover {
      background-color: #EFF1F4;
      border-radius: 16px;
      box-shadow: #EFF1F4 2px 2px 5px;
    }
  }
</style>
