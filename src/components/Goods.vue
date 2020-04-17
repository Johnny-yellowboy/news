<template>
  <div class="goods">
    <el-button type="success" plain class="mb10" @click="$router.push('/add-goods')">添加商品</el-button>
    <template>
      <el-table :data="goodsData">
        <el-table-column label="#" type="index" :index="indexMethod"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="upd_time">
          <template slot-scope="{ row }">{{ row.upd_time | timeFilter }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" icon="el-icon-edit" plain></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" plain @click="delGoods(row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
      background
      class="mt10"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsData: [],
      goods_name: '',
      goods_price: '',
      goods_weight: '',
      upd_time: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async getGoodsList() {
      let res = await this.axios.get('goods', {
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
        this.goodsData = data.goods
        this.total = data.total
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getGoodsList()
    },
    indexMethod(index) {
      // console.log(index)
      return index + 1 + (this.currentPage - 1) * this.pageSize
    },
    async delGoods(id) {
      let res = await this.axios.delete(`goods/${id}`)
      let {
        meta: { status }
      } = res
      if (status === 200) {
        this.$confirm('你确定要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.total--
            this.currentPage = Math.ceil(this.total / this.pageSize)
            this.getGoodsList()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style></style>
