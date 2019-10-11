<template>
  <div style="position: relative;">
    <div class="user-info-item">
      <section style="padding: 0">
        <el-image
          style="width: 100%; height: 160px; border-radius: 8px 8px 0 0; margin: 0;"
          src="/example.jpg"/>
      </section>
      <section style="margin-top: 32px" :title="userInfo.userId">
        <i class="el-icon-edit" @click="doItemEdit('phone')"></i>
        <label>电话号码</label>
        <span>{{userInfo.phone}}</span>
      </section>
      <div>&nbsp;</div>
      <section :title="userInfo.token">
        <label>注册时间</label>
        <span>{{userRegTime}}</span>
      </section>
      <div>&nbsp;</div>
      <section>
        <i class="el-icon-edit" @click="doItemEdit('email')"></i>
        <label>电子邮箱</label>
        <span>{{userEmail}}</span>
      </section>
      <div>&nbsp;</div>
      <section>
        <i class="el-icon-edit" @click="doItemEdit('wxb')"></i>
        <label>微信绑定</label>
        <span>{{userWx}}</span>
      </section>
      <div>&nbsp;</div>
      <section>
        <i class="el-icon-edit" @click="doItemEdit('gender')"></i>
        <label>用户性别</label>
        <span>{{userGender}}</span>
      </section>
      <div>&nbsp;</div>
      <section :title="userRegion.uid">
        <i class="el-icon-edit" @click="doItemEdit('region')"></i>
        <label>所处地区</label>
        <span>{{userRegion.name}}</span>
      </section>
      <div>&nbsp;</div>
      <section :title="userDepartment.uid">
        <label>所在部门</label>
        <span>{{userDepartment.name}}</span>
      </section>
      <div>&nbsp;</div>
      <section>
        <label>拥有角色</label>
        <span v-for="(role, index) in userRoleList" :key="index" :title="role.depict">
              {{role.name}}
            </span>
      </section>
    </div>
    <div style="position:absolute; top: 132px; left: 32px;" title="用户头像">
      <img :src="userPhoto" class="user-photo"/>
    </div>
    <div style="position:absolute; top: 165px; right: 32px;" title="用户名称">
      <span style="color: #409EFF; font-size: 18px;">{{userInfo.username}}</span>
    </div>
  </div>
</template>

<script>

import { DateFormat } from '../utils/PublicFunction.js'

export default {
  name: 'UserInfoView',
  data () {
    return {
      userInfo: this.$store.getters.userInfo
    }
  },
  methods: {
    doItemEdit (key) {
      console.log(key)
    }
  },
  computed: {
    userPhoto: function () {
      if (this.$data.userInfo.photo.length <= 0) {
        return '/favicon.ico'
      } else {
        return this.$data.userInfo.photo
      }
    },
    userRegTime: function () {
      return DateFormat('yyyy-MM-dd hh:mm:ss', new Date(this.$data.userInfo.regTime))
    },
    userEmail: function () {
      if (this.$data.userInfo.email.length <= 0) {
        return '未绑定'
      } else {
        return this.$data.userInfo.email
      }
    },
    userWx: function () {
      if (this.$data.userInfo.wxOid.length <= 0) {
        return '未绑定'
      } else {
        return this.$data.userInfo.wxOid
      }
    },
    userGender: function () {
      let gender = parseInt(this.$data.userInfo.gender)
      if (gender === 0) {
        return '未填写'
      } else if (gender === 1) {
        return '男'
      } else if (gender === 2) {
        return '女'
      } else {
        return this.$data.userInfo.gender
      }
    },
    userRegion: function () {
      if (this.$data.userInfo.region === undefined ||
          !this.$data.userInfo.region.hasOwnProperty('uid') ||
          !this.$data.userInfo.region.hasOwnProperty('name')) {
        return { uid: '0', name: '未指定' }
      } else {
        return this.$data.userInfo.region
      }
    },
    userDepartment: function () {
      if (this.$data.userInfo.department === undefined ||
          !this.$data.userInfo.department.hasOwnProperty('uid') ||
          !this.$data.userInfo.department.hasOwnProperty('name')) {
        return { uid: '0', name: '未指定' }
      } else {
        return this.$data.userInfo.department
      }
    },
    userRoleList: function () {
      if (this.$data.userInfo.roleList === undefined || this.$data.userInfo.roleList.length <= 0) {
        return [{ uid: '0', name: '未指定' }]
      } else {
        return this.$data.userInfo.roleList
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-info-item {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: #cccccc 5px 5px 10px;
    margin: 16px;
    padding: 0 0 8px 0;

    section {
      padding: 8px 16px;
      text-align: left;

      &:hover {
        background-color: #EFF1F4;

        i {
          /*color: #EFF1F4;*/
        }
      }

      i {
        float: right;
        line-height: 24px;
        margin-right: 4px;
        padding: 4px 8px;
        border-radius: 20px;
        color: #cccccc;
        margin-top: 4px;

        &:hover {
          background-color: #409EFF;
          cursor: pointer;
          color: #ffffff;
        }
      }

      label {
        font-size: 12px;
        color: #666666;
      }

      span {
        font-size: 14px;
        display: block;
      }
    }

    div {
      height: 1px;
      margin: 0 10px;
      background-color: #eeeeee;
    }
  }

  .user-photo {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    box-shadow: #cccccc 1px 1px 3px;
  }
</style>
