<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeStatus(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
          <el-button
            type="success"
            icon="el-icon-arrow-down"
            size="mini"
            plain
            @click="showAssignUser(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[4, 8, 12, 16]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 弹窗 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addfrom" :rules="rules" ref="addfrom">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="addfrom.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="addfrom.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="addfrom.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="mobile">
          <el-input v-model="addfrom.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editfrom" :rules="rules" ref="editfrom">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="editfrom.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editfrom.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editfrom.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配角色" width="40%" :visible.sync="assignDialogVisible">
      <el-form :model="assignform">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="assignform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表" prop="userlist" label-width="100px">
          <el-select v-model="assignform.selectValue" placeholder="请选择">
            <el-option
              v-for="item in assignform.userlist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data() {
    return {
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 4,
      total: 0,
      formLabelWidth: '100px',
      addDialogVisible: false,
      editDialogVisible: false,
      addfrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      editfrom: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignDialogVisible: false,
      assignform: {
        id: '',
        username: '',
        userlist: [],
        selectValue: ''
      }
    }
  },
  methods: {
    async getuserList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // .then(res => {
      console.log(res)
      if (res.meta.status === 200) {
        this.userList = res.data.users
        this.total = res.data.total
      }
      // })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getuserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getuserList()
    },
    search() {
      this.currentPage = 1
      this.getuserList()
    },
    async delUser(id) {
      console.log(id)
      try {
        await this.$confirm('你确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // .then(() => {
        let res = await this.axios({
          method: 'delete',
          url: `users/${id}`
        })
        // .then(res => {
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.userList.length <= 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getuserList()
        }
        // })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // })
    },
    async changeStatus(row) {
      // console.log(res)
      let res = await this.axios({
        method: 'put',
        url: `users/${row.id}/state/${row.mg_state}`
      })
      // .then(res => {
      if (res.meta.status === 200) {
        this.$message.success('修改成功')
        this.getuserList()
      } else {
        this.$message.waring('修改失败')
        this.getuserList()
      }
      // })
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    addUser() {
      this.$refs.addfrom.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          method: 'post',
          url: 'users',
          data: this.addfrom
        })
        // .then(res => {
        let {
          meta: { status, msg }
        } = res
        console.log(status)
        if (status === 201) {
          // 清空表单
          this.$refs.addfrom.resetFields()
          // 关闭
          this.addDialogVisible = false
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          this.getuserList()
          this.$message.success('添加用户成功')
        } else {
          this.$message.error(msg)
        }
        // })
      })
    },
    showEditDialog(info) {
      // console.log(info)
      this.editfrom.id = info.id
      this.editfrom.username = info.username
      this.editfrom.email = info.email
      this.editfrom.mobile = info.mobile
      this.editDialogVisible = true
    },
    editUser() {
      this.$refs.editfrom.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          method: 'put',
          url: `users/${this.editfrom.id}`,
          data: this.editfrom
        })
        console.log(res)
        // .then(res => {
        let {
          meta: { status, msg }
        } = res
        if (status === 200) {
          this.editDialogVisible = false
          this.$message.success('修改用户成功')
          this.getuserList()
        } else {
          this.$message.error(msg)
        }
      })
      // })
    },
    async showAssignUser(row) {
      // console.log(row)
      this.assignform.id = row.id
      this.assignform.username = row.username
      this.assignDialogVisible = true
      // 根据用户id查询当前角色id
      let info = await this.axios.get(`users/${row.id}`)
      // console.log(info)
      if (info.meta.status === 200) {
        if (info.data.rid === -1) {
          info.data.rid = ''
        }
        this.assignform.selectValue = info.data.rid
      }

      let res = await this.axios.get('roles')
      let {
        meta: { msg, status },
        data
      } = res
      // console.log(res)

      if (status === 200) {
        this.assignform.userlist = data
      } else {
        this.$message.info(msg)
      }
    },
    async assignUser() {
      // this.axios
      //   .put(`users/${this.assignform.id}/role`, {
      //     rid: this.assignform.selectValue
      //   })
      //   .then(res => {
      //     console.log(res)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
      if (!this.assignform.selectValue) {
        this.$message.error('请选择一个角色')
        return
      }
      let res = await this.axios.put(`users/${this.assignform.id}/role`, {
        rid: this.assignform.selectValue
      })
      let {
        meta: { status, msg }
      } = res
      if (status === 200) {
        this.assignDialogVisible = false
        this.$message.success(msg)
      }
    }
  },
  created() {
    this.getuserList()
  }
}
</script>

<style lang="less" scoped>
.users {
  .input-with-select {
    width: 400px;
    margin-bottom: 10px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
