<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/categories' }">商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="showAddCateDialog" class="mb10">添加分类</el-button>
    <el-table :data="categoryList">
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
      ></el-table-tree-column>
      <el-table-column label="层级" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="showCategoryDialog"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="deleteCategory(row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 16, 24, 32]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="分类名称" prop="cat_name" label-width="80px">
          <el-input placeholder="请输入分类名称" v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" label-width="80px">
          <el-cascader v-model="addForm.cat_pid" :options="options" :props="props" filterable clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      pageSize: 8,
      currentPage: 1,
      total: 0,
      addCateDialogVisible: false,
      addForm: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      cateDialogVisible: false
    }
  },
  methods: {
    async getCategoryList() {
      let res = await this.axios.get('categories', {
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data
      } = res
      console.log(res)
      if (status === 200) {
        this.categoryList = data.result
        this.total = data.total
      }
    },
    showCategoryDialog() {},
    async showAddCateDialog() {
      this.addCateDialogVisible = true
      let res = await this.axios.get('categories', {
        params: {
          type: 2
        }
      })
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.options = data
      }
    },
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        // console.log(valid)
        if (!valid) return false
        let res = await this.axios.post('categories', {
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0,
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length
        })
        let {
          meta: { status }
        } = res
        if (status === 201) {
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          this.getCategoryList()
          this.$refs.addForm.resetFields()
          this.addCateDialogVisible = false
        }
        // console.log(res)
      })
    },
    async deleteCategory(id) {
      let res = await this.axios.delete(`categories/${id}`)
      console.log(res)
      let {
        meta: { status, msg }
      } = res
      if (status === 200) {
        this.total--
        this.currentPage = Math.ceil(this.total / this.pageSize)
        this.$message.success(msg)
        this.getCategoryList()
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getCategoryList()
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style></style>
