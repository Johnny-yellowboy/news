<template>
  <div class="orders">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/orders' }"
        >订单列表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <template>
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column
          fixed
          prop="order_id"
          label="用户ID"
          width="80"
        ></el-table-column>
        <el-table-column prop="create_time" label="订单日期" width="200">
          <template slot-scope="{ row }">{{
            row.create_time | timeFilter
          }}</template>
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="260"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="120"
        ></el-table-column>
        <el-table-column prop="pay_status" label="支付状态" width="120">
          <template slot-scope="{ row }">
            <i
              class="pay-success fb el-icon-check"
              v-if="row.pay_status == 1"
            ></i>
            <i class="pay-error fb el-icon-close" v-else></i>
          </template>
        </el-table-column>
        <el-table-column prop="pay_status" label="支付方式" width="120">
          <template slot-scope="{ row }">
            <template>
              <span class="no-pay" v-if="row.order_pay == 0">未支付</span>
              <span class="wx-pay" v-else-if="row.order_pay == 1">支付宝</span>
              <span class="zfb-pay" v-else-if="row.order_pay == 2">微信</span>
              <span class="yhk-pay" v-else>银行卡</span>
            </template>
            <!-- {{ row.order_pay }} -->
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否已发货" width="150">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.is_send"
              @change="isSend(row)"
              active-value="是"
              inactive-value="否"
              active-color="#409EFF"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_fapiao_title"
          label="发票抬头"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="order_fapiao_company"
          label="公司名称"
          width="150"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small" @click="showEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[6, 12, 18, 24]"
      :page-size="this.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
      background
      class="mt10"
    ></el-pagination>
    <!-- 编辑框 -->
    <el-drawer
      :before-close="handleClose"
      :visible.sync="editOrderDialog"
      direction="ltr"
      class="drawer-body"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="orderform" ref="orderform" :rules="rules">
          <el-form-item
            label="发票公司名称"
            label-width="120px"
            prop="order_fapiao_company"
          >
            <el-input
              v-model="orderform.order_fapiao_company"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="支付方式" label-width="120px">
            <!-- <el-input v-model="orderform.orderpay"></el-input> -->
            <el-select v-model="selectValue" placeholder="请选择支付方式">
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单价格" label-width="120px" prop="order_price">
            <el-input v-model="orderform.order_price"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            @click="$refs.drawer.closeDrawer(row)"
            :loading="loading"
            >{{ loading ? '提交中 ...' : '确 定' }}</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 6,
      orderList: [],
      total: 0,
      editOrderDialog: false,
      loading: false,
      orderform: {
        order_id: '',
        order_pay: '',
        is_send: '',
        order_fapiao_company: '',
        order_price: ''
      },
      selectValue: '',
      selectOptions: [
        {
          value: '0',
          label: '未支付'
        },
        {
          value: '1',
          label: '支付宝'
        },
        {
          value: '2',
          label: '微信'
        },
        {
          value: '3',
          label: '银行卡'
        }
      ],
      rules: {
        order_fapiao_company: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        order_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getOrderslist() {
      let res = await this.axios.get('orders', {
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      let {
        meta: { status },
        data: { goods, total }
      } = res
      if (status === 200) {
        this.orderList = goods
        this.orderList = goods
        this.total = total
      } else {
        this.$message.error('数据获取失败')
      }
    },
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`)
      this.pageSize = size
      this.getOrderslist()
    },
    handleCurrentChange(page) {
      console.log(`当前页: ${page} `)
      this.currentPage = page
      this.getOrderslist()
    },
    async isSend(row) {
      // console.log(row)
      var send
      if (row.is_send === '是') {
        send = 1
      } else {
        send = 0
      }
      let res = await this.axios.put(`orders/${row.order_id}`, {
        order_price: row.order_price,
        is_send: send
      })
      // console.log(res)
      let {
        meta: { msg, status }
      } = res
      if (status === 201) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
      this.currentPage = 1
      this.getOrderslist()
    },
    showEdit(row) {
      this.editOrderDialog = true
      this.orderform.order_price = row.order_price
      this.orderform.order_id = row.order_id
      this.orderform.order_fapiao_company = row.order_fapiao_company
      this.orderform.order_pay = row.order_pay
      this.selectValue = row.order_pay
      if (row.order_pay === 0) {
        this.selectValue = '未支付'
      } else if (row.order_pay === 1) {
        this.selectValue = '支付宝'
      } else if (row.order_pay === 2) {
        this.selectValue = '微信'
      } else if (row.order_pay === 3) {
        this.selectValue = '银行卡'
      }
      console.log(row)
    },
    handleClose(done) {
      this.$refs.orderform.validate(async valid => {
        console.log(valid)
        if (!valid) return false
        if (this.loading) {
          return
        }
        let id = this.orderform.order_id
        let res = await this.axios.put(`orders/${id}`, {
          order_fapiao_company: this.orderform.order_fapiao_company,
          order_pay: this.selectValue,
          order_price: this.orderform.order_price
        })
        let {
          meta: { status, msg }
        } = res
        if (status === 201) {
          this.$confirm('确定要提交表单吗？')
            .then(() => {
              this.loading = true
              this.timer = setTimeout(() => {
                done()
                // 动画关闭需要一定的时间
                setTimeout(() => {
                  this.loading = false
                  this.$message.success(msg)
                  this.getOrderslist()
                }, 400)
              }, 600)
            })
            .catch(() => {})
        } else {
          this.$message.error(msg)
        }
      })
    },
    cancelForm() {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
    }
  },
  created() {
    this.getOrderslist()
  },
  filters: {
    // 定义局部过滤器（格式化时间）
    timeFilter: (data, format = 'MM-DD HH:mm') => {
      return moment(data * 1000).format(format)
    }
  }
}
</script>

<style lang="less" scoped>
.orders {
  .pay-success {
    color: #67c23a;
  }
  .pay-error {
    color: #f56c6c;
  }
  /deep/.el-drawer__body {
    padding: 20px;
  }
  .no-pay {
    color: #cc0000;
  }
  .wx-pay {
    color: #4fc436;
  }
  .zfb-pay {
    color: #007dbe;
  }
  .yhk-pay {
    color: #ff9900;
  }
  /deep/.demo-drawer__content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  /deep/.demo-drawer__footer {
    display: flex;
  }
  /deep/.demo-drawer__footer button {
    flex: 1;
  }
}
</style>
