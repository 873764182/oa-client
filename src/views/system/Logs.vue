<template>
  <div class="root">
    <el-table
      v-permission="apis.fls"
      :data="tableData" border style="width: 95%; margin: 16px auto;">
      <el-table-column
        prop="time"
        label="最后修改时间"
        width="180">
        <template slot-scope="scope">{{ dateTime(scope.row.time) }}</template>
      </el-table-column>
      <el-table-column
        prop="size"
        label="文件大小"
        width="180">
        <template slot-scope="scope">{{ (scope.row.size / 1000 / 1000).toFixed(2) + 'M' }}</template>
      </el-table-column>
      <el-table-column
        prop="path"
        label="文件路径">
      </el-table-column>
      <el-table-column
        label="操作" width="210">
        <template slot-scope="scope">
          <el-button
            size="mini" v-permission="apis.fld"
            @click="handleRead(scope.$index, scope.row)">查看
          </el-button>
          <el-button
            size="mini" v-permission="apis.fld"
            @click="handleDownload(scope.$index, scope.row)">下载
          </el-button>
          <el-button
            v-permission="apis.fdd"
            size="mini" type="danger" v-show="scope.$index !== 0"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="90%" :title="dialogTitle" :visible.sync="dialogVisible">
      <p v-html="logData"></p>
    </el-dialog>
  </div>
</template>

<script>
import { DateFormat, DownloadData } from '../../utils/PublicFunction.js'

export default {
  name: 'Logs',
  data () {
    return {
      apis: this.$route.meta.apis,
      tableData: [],
      dialogVisible: false,
      dialogTitle: '',
      logData: ''
    }
  },
  mounted () {
    this.loadList()
  },
  methods: {
    loadList: function () {
      this.$route.meta.apis.fls()
        .then(res => {
          if (res.code === 0) {
            this.$data.tableData = res.data
          } else {
            this.$message(res.msg)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    handleRead: function (index, row) {
      this.$route.meta.apis.fld({ path: row.path })
        .then(res => {
          this.$data.dialogVisible = true
          this.$data.dialogTitle = row.name
          this.$data.logData = res.toString()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    handleDownload: function (index, row) {
      this.$route.meta.apis.fld({ path: row.path })
        .then(res => {
          DownloadData(row.name, JSON.stringify(res))
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    handleDelete: function (index, row) {
      this.$route.meta.apis.fdd({ path: row.path })
        .then(res => {
          if (res.code === 0) {
            this.loadList()
          }
          this.$message(res.msg)
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    }
  },
  computed: {
    dateTime: function () {
      return function (time) {
        return DateFormat('yyyy-MM-dd hh:mm:ss', new Date(time))
      }
    }
  }
}
</script>

<style scoped>

</style>
