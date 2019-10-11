<template>
  <div class="root">
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <UserInfoView/>
      </el-col>
      <el-col :span="6">

      </el-col>
      <el-col :span="6">

      </el-col>
      <el-col :span="6">

      </el-col>
    </el-row>
  </div>
</template>

<script>

import UserInfoView from '../../components/UserInfoView.vue'

export default {
  name: 'Personal',
  data () {
    return {}
  },
  mounted: function () {
  },
  components: {
    UserInfoView
  }
}
</script>

<style lang="scss" scoped>

</style>
