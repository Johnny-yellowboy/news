<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/roles' }">角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain class="fl mb10" @click="showAddDialog">添加角色</el-button>
    <el-table :data="rolesList">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <span v-if="row.children.length === 0">暂无权限</span>
          <el-row v-for="item in row.children" :key="item.id" class="leval1">
            <el-col :span="4">
              <el-tag
                type="primary"
                effect="dark"
                closable
                @close="delRight(row,item.id)"
              >{{ item.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item2 in item.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    effect="dark"
                    closable
                    class="leval2"
                    @close="delRight(row,item2.id)"
                  >{{ item2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    effect="dark"
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    class="leval3"
                    @close="delRight(row,item3.id)"
                  >{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="{row}">
          <el-button type="success" plain icon="el-icon-edit" size="mini" @click="editRoles(row)"></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="delRoles(row.id)"
          ></el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="showEditDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹框 -->
    <el-dialog title="角色授权" :visible.sync="editDialog" width="40%">
      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRights">分 配</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="this.roleForm.id ? '修改角色' :'添加角色'" :visible.sync="addDialog" width="40%">
      <el-form :model="roleForm" label-width="100px" ref="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">{{this.roleForm.id ? '修改' :'添加'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      roleName: '',
      roleDesc: '',
      editDialog: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      nowId: '',
      addDialog: false,
      roleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在2-6个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在2-12个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRolesList() {
      let res = await this.axios.get('roles')
      let {
        meta: { msg, status },
        data
      } = res

      if (status === 200) {
        this.rolesList = data
      } else {
        this.$message.info(msg)
      }
    },
    async delRight(row, rightId) {
      console.log(row, rightId)
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      // console.log(res)
      let {
        meta: { status, msg },
        data
      } = res
      if (status === 200) {
        row.children = data
        this.$message.success(msg)
      } else {
        this.$message.info(msg)
      }
    },
    // getRightsList() {
    //   this.axios.get('rights/tree').then(res => {
    //     console.log(res)
    //     let {
    //       data,
    //       meta: { status }
    //     } = res
    //     if (status === 200) {
    //       this.treeData = data
    //     }
    //   })
    // },
    async showEditDialog(row) {
      this.editDialog = true
      this.nowId = row.id
      let res = await this.axios.get('rights/tree')
      let {
        data,
        meta: { status }
      } = res
      if (status === 200) {
        // console.log(data)
        this.treeData = data
      }
      let ids = []
      // console.log(row)
      row.children.forEach(id1 => {
        id1.children.forEach(id2 => {
          id2.children.forEach(id3 => {
            // console.log(id3.id)
            ids.push(id3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    async addRights() {
      let keys = this.$refs.tree.getCheckedKeys()
      let parentKeys = this.$refs.tree.getHalfCheckedKeys()
      console.log(keys)
      console.log(parentKeys)
      let ids = keys.concat(parentKeys).join()
      console.log(ids)

      let res = await this.axios.post(`roles/${this.nowId}/rights`, {
        rids: ids
      })
      console.log(res)
      let {
        meta: { status, msg }
      } = res
      if (status === 200) {
        this.editDialog = false
        this.getRolesList()
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    showAddDialog() {
      this.addDialog = true
      this.roleForm.roleName = ''
      this.roleForm.roleDesc = ''
      this.roleForm.id = ''
    },
    addRoles() {
      this.$refs.roleForm.validate(async valid => {
        console.log(valid)
        if (!valid) return false
        let method = this.roleForm.id ? 'put' : 'post'
        let url = this.roleForm.id ? `roles/${this.roleForm.id}` : 'roles'
        let data = this.roleForm
        let _status = this.roleForm.id ? 200 : 201
        let res = await this.axios({
          method: method,
          url,
          data
        })
        console.log(res)

        let {
          meta: { status, msg }
        } = res
        if (status === _status) {
          this.$refs.roleForm.resetFields()
          this.addDialog = false
          this.getRolesList()
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      })
    },
    editRoles(row) {
      this.addDialog = true
      this.roleForm.roleName = row.roleName
      this.roleForm.roleDesc = row.roleDesc
      this.roleForm.id = row.id
    },
    async delRoles(id) {
      try {
        await this.$confirm('你确定要删除角色吗？', {
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${id}`)
        let {
          meta: { status, msg }
        } = res
        console.log(res)

        if (status === 200) {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
        this.addDialog = false
        this.getRolesList()
      } catch (e) {
        this.$message.info('取消删除')
      }
    }
  },
  created() {
    this.getRolesList()
    this.$message.success('获取列表成功')
  }
}
</script>

<style lang="less" scoped>
.leval1 {
  border-bottom: 1px solid #ccc;
  margin-bottom: 5px;
}
.leval3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
