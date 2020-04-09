<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }">权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightsList">
      <el-table-column prop="#" label="#" type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
          <span v-if="+scope.row.level === 0">一级</span>
          <span v-else-if="+scope.row.level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      // let res = await this.axios({
      //   method: 'get',
      //   url: 'rights/list'
      // })
      // 简写
      let res = await this.axios.get('rights/list')
      // console.log(res)
      let {
        data,
        meta: { status }
      } = res
      if (status === 200) {
        // console.log(msg)
        this.rightsList = data
      } else {
        this.$message.info('获取列表失败')
      }
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style>
</style>
